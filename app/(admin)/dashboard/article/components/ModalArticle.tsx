"use client";
import React, { useState } from "react";
// import { Button, Form, Space } from "antd";
import TextEditor from "@/components/plugin/TextEditor";
import MetadataForm from "./MetadataForm";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  Space,
  Typography,
  Image,
  Tag,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import PublishInfoForm from "./PublishInfoForm";
// import TextEditor from "@/components/plugin/TextEditor";

const initialMetadata = {
  description: "",
  keywords: "",
  robots: "",
  author: "",
};
const { Option } = Select;
const { TextArea } = Input;
const ModalArticle = () => {
  const [editorData, setEditorData] = useState("");
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Xử lý upload ảnh
  const handleImageChange = (info: any) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      // Hiển thị ảnh preview
      const reader = new FileReader();
      reader.onload = (e) => setImageUrl(e.target?.result as string);
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  // Xóa ảnh
  const handleRemoveImage = () => setImageUrl(null);

  // Submit form
  const onFinish = (values: any) => {
    message.success("Đã lưu bài viết!");
    // Gửi dữ liệu lên server ở đây
    console.log(values);
  };

  return (
    <div className="p-6 w-full">
      {/* Header */}

      {/* Nội dung 2 cột */}
      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
          width: "100%",
          // border:'1px solid #131313'
        }}
      >
        {/* Editor bên trái */}
        <div
          style={{
            flex: 2,
            minWidth: 0,
            border: "1px solid #d9d9d9",
            borderRadius: 8,
            padding: 16,
            boxShadow: "0 2px 8px #f0f1f2",
          }}
        >
          <div
            style={{
              background: "#eaf6ff",
              padding: 12,
              borderRadius: 4,
              marginBottom: 24,
            }}
          >
            <Space>
              <Tag color="green">Đã xuất bản</Tag>
              <Typography.Text strong>
                Công ty Cổ phần Thương mại Du lịch Lan Phương
              </Typography.Text>
            </Space>
            <Button style={{ float: "right" }} type="primary">
              Lấy tin nhanh
            </Button>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              status: "published",
              postType: "Tổng hợp",
              postKind: "Bài viết",
              title: "",
              description: "",
              quote: "",
              content: "",
            }}
          >
            <Form.Item label="Trạng thái" name="status">
              <Select disabled>
                <Option value="published">Đã xuất bản</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Loại bài viết"
              name="postType"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Tổng hợp">Tổng hợp</Option>
                <Option value="Tin tức">Tin tức</Option>
                <Option value="Khuyến mãi">Khuyến mãi</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Kiểu bài viết"
              name="postKind"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Bài viết">Bài viết</Option>
                <Option value="Sản phẩm">Sản phẩm</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Nhập tiêu đề!" }]}
            >
              <TextArea rows={2} placeholder="Nhập tiêu đề bài viết" />
            </Form.Item>

            <Form.Item label="Hình ảnh">
              <Space align="start">
                {imageUrl && (
                  <div style={{ textAlign: "center" }}>
                    <Image
                      src={imageUrl}
                      width={180}
                      style={{ marginBottom: 8 }}
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                      onClick={handleRemoveImage}
                    >
                      Xóa
                    </Button>
                  </div>
                )}
                {!imageUrl && (
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false} // Không upload lên server ngay
                    onChange={handleImageChange}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />}>Chọn file</Button>
                  </Upload>
                )}
              </Space>
            </Form.Item>

            <Form.Item label="Mô tả ảnh" name="description">
              <Input placeholder="Mô tả ảnh minh họa" />
            </Form.Item>

            <Form.Item
              label="Trích dẫn"
              name="quote"
              rules={[{ required: true, message: "Nhập trích dẫn!" }]}
            >
              <Input placeholder="VD: 13,000,000 / khách" />
            </Form.Item>

            <Form.Item
              label="Nội dung"
              name="content"
              rules={[{ required: true, message: "Nhập nội dung!" }]}
            >
              <TextEditor
                content={editorData}
                editorData={editorData}
                setEditorData={setEditorData}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Lưu bài viết
              </Button>
            </Form.Item>
          </Form>
        </div>
        {/* Metadata bên phải */}
        <div style={{ flex: 1, minWidth: 300, maxWidth: 400 }}>
          <PublishInfoForm form={form} initialValues={initialMetadata} />
          <MetadataForm form={form} initialValues={initialMetadata} />
        </div>
      </div>
    </div>
  );
};

export default ModalArticle;

