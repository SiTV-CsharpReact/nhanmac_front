"use client";
import React, { memo, useEffect, useState } from "react";
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
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import PublishInfoForm from "./PublishInfoForm";
import { Post } from "@/types/contentItem";
// import TextEditor from "@/components/plugin/TextEditor";
import { getBase64 } from "@/utils/util";
import { env } from "@/config/env";
import { uploadImage, createContent, updateContent } from "@/modules/admin/contentApi";
import dayjs from "dayjs";
import moment from "moment";

const initialMetadata = {
  description: "",
  keywords: "",
  robots: "",
  author: "",
};
const { TextArea } = Input;
interface StatusModal {
  idContent?: number | undefined;
  openModal: boolean;
  typeModal: number | undefined;
}


interface typeContentArticle {
  typeModal: number | undefined;
  data: Post;
  reset?: boolean;
  setTypeModal: (modal: StatusModal) => void;
  setOnReload:()=>void;
}

const ContentArticle: React.FC<typeContentArticle> = ({
  typeModal,
  setTypeModal,
  setOnReload,
  data,
  reset,
}) => {
  // console.log(data)
  const [editorData, setEditorData] = useState("");
  const [content, setContent] = useState("");
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isUpload, setIsUpload] = useState(false);
  const [urlFile, setUrlFile] = useState({});

  // Reset form khi modal mở
  useEffect(() => {
    if (reset) {
      form.resetFields();
      setEditorData("");
      setContent("");
      setImageUrl(null);
      setFileList([]);
      setIsUpload(false);
      setUrlFile({});
    }
  }, [reset, form]);

  // Props cho Upload

  // Hiển thị ảnh
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    const url = file.url as string;
    const preview = file.preview as string;
    setPreviewImage(url || preview || "");
    setPreviewOpen(true);
  };

  // Hàm upload ảnh

  const uploadProps = {
    name: "file",
    action: env.uploadUrl,
    accept: "image/*",
    listType: "picture",
    beforeUpload: (file: File) => {
      setIsUpload(true);
      // const type = getExtension(file.name);
      // if (fileType[type] === undefined) {
      //   setFileList((state) => [...state]);
      //   message.error(`${file.name} không đúng định dạng`);
      //   setIsUpload(false);
      //   return false;
      // } else

      if (file.size / (1024 * 1024) > 5) {
        setFileList((state) => [...state]);
        message.error("Ảnh vượt quá dung lượng cho phép (5Mb)");
        setIsUpload(false);
        return false;
      } else {
        setFileList((state) => [...state, file]);
        return true;
      }
    },
    onRemove: (file: File) => {
      if (fileList.some((item) => item.uid === file?.uid)) {
        setFileList((fileList) =>
          fileList.filter((item) => item.uid !== file.uid)
        );
        setUrlFile({});
        setIsUpload(false);
        return true;
      } else {
        return false;
      }
    },
    onChange(info) {
      if (info.file.status === "done" && info?.file?.response != "") {
        setFileList(info.fileList);
        setUrlFile({
          pictureName: info?.file?.name,
          pictureUrl: info?.file?.response?.Data?.imageUrl,
        });
        setIsUpload(true);
      }

      if (info.file.status === "error") {
        message.error(
          `${info.file.name} upload không thành công bạn hãy thử lại`
        );
        setFileList((fileList) =>
          fileList.filter((item) => item.uid !== info.file.uid)
        );
        setIsUpload(false);
      }
    },
    fileList,
  };


  const reloadPage=()=>{
    setTypeModal({
      // idContent: record?.id,
      typeModal: 4,
      openModal: false,
    })
    form.resetFields();
    setEditorData("");
    setImageUrl(null);
    setFileList([]);
    setUrlFile({});
    setOnReload();
  }
  // Submit form
  const onFinish = async (values: any) => {
    try {
      const formData = {
        ...values,
        state: 1,
         picture:'',
        introtext: editorData,
        created: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        title_alias: "test",
        alias: "test-thu",
        urls:urlFile?.pictureUrl,
        image:urlFile?.pictureName
      };

      if (typeModal === 1) {
        // Tạo mới
        const response = await createContent(formData);
        if (response.Code === 200) {
          reloadPage()
        } else {
          message.error(response.Message || "Tạo bài viết thất bại!");
        }
      } else {
        console.log(data?.id)
        // Cập nhật
        const response = await updateContent(data?.id,formData);
        if (response.Code === 200) {
          message.success("Cập nhật bài viết thành công!");
          reloadPage();
        } else {
          message.error(response.Message || "Cập nhật bài viết thất bại!");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Có lỗi xảy ra khi xử lý bài viết!");
    }
  };

  useEffect(() => {
    if (data) {
     
      // const formattedDate = moment(data?.publish_up).format("DD/MM/YYYY HH:mm:ss");
      console.log('dayjs:', dayjs(publish_up).isValid());
      form.setFieldsValue({
        title: data.title,
        // description: data.description,
        image_desc: data.image_desc,
        content: data.introtext,
        catid:data.catid,
        publish_up: data.publish_up ? dayjs(data.publish_up) : null,
        // picture:'test'
        // Thêm các trường khác nếu cần
      });
      setEditorData(data.introtext || "");
      setContent(data.introtext || "");
      setImageUrl(data?.urls);
      setIsUpload(false);
      setUrlFile({});
      data?.urls &&  setFileList([
        {
          uid: '-1', // Thêm một uid tạm thời
          name: data?.images, // Tên tạm thời của ảnh
          status: 'done', // Đặt trạng thái là đã hoàn thành để hiển thị hình ảnh
          url: data?.urls, // Sử dụng đường dẫn ảnh từ API
        }
      ]);
      setUrlFile({
        pictureName: data?.images,
        pictureUrl: data?.urls,
      });
      // setIsUpload(true);
    }
  }, [data, form]);

  return (
    <div className="px-4 py-2 w-full">
      {/* Header */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="[&_.ant-form-item]:!mb-[10px]"
      >
        {/* Nội dung 2 cột */}
        <div
          style={{
            display: "flex",
            gap: 12,
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
              paddingBottom:5,
              boxShadow: "0 2px 8px #f0f1f2",
            }}
          >
            <div
              style={{
                background: "#eaf6ff",
                padding: 12,
                borderRadius: 4,
                marginBottom: 10,
              }}
            >
              <Space>
                <Typography.Text strong>
                  Công ty Cổ phần Thương mại Du lịch Lan Phương
                </Typography.Text>
                {typeModal == 2&&
                <Tag
                  color={data?.state == 1 ? "green" : "orange"}
                  className="pl-3"
                >
                  {data?.state == 1 ? `Đã xuất bản` : `Chưa xuất bản`}
                </Tag>}
              </Space>
            </div>

            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Nhập tiêu đề!" }]}
            >
              <TextArea rows={2} placeholder="Nhập tiêu đề bài viết" />
            </Form.Item>

            <Form.Item
              name="picture"
              label=""
              colon={false}
              style={{ marginBottom: 0 }}
            >
              <Upload {...uploadProps} onPreview={handlePreview}>
                {!imageUrl && (
                  <Button
                    style={{ display: "flex", alignItems: "center" }}
                    icon={<UploadOutlined />}
                    disabled={isUpload}
                  >
                    Tải ảnh lên
                  </Button>
                )}
              </Upload>
            </Form.Item>
            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}

            <Form.Item label="Mô tả ảnh" name="image_desc">
              <Input placeholder="Mô tả ảnh minh họa" />
            </Form.Item>

            <Form.Item
              label="Nội dung"
              name="content"
              rules={[
                {
                  // required: true,
                  max: 5000,
                  message: "Tối đa 5000 kí tự",
                },
              ]}
            >
              <TextEditor
                content={content}
                editorData={editorData}
                setEditorData={setEditorData}
              />
            </Form.Item>
            
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {typeModal === 1 ? "Lưu bài viết" : "Cập nhật bài viết"}
                </Button>
              </Form.Item>
       
          </div>
          {/* Metadata bên phải */}
          {typeModal !== 0 && (
            <div style={{ flex: 1, minWidth: 300, maxWidth: 400 }}>
              <PublishInfoForm initialValues={initialMetadata} />
              <MetadataForm  initialValues={initialMetadata} />
            </div>
          )}
        </div>
      
      </Form>
    </div>
  );
};

export default memo(ContentArticle);

// const uploadProps: UploadProps = {
//   accept: "image/*",
//   listType: "picture",
//   fileList,
//   action: env.uploadUrl,
//   name: "image",
//   headers: {
//     // Thêm headers nếu cần
//   },
//   beforeUpload: (file: File) => {
//     console.log("beforeUpload called", file);
//     const isImage = file.type.startsWith("image/");
//     if (!isImage) {
//       message.error("Chỉ được upload file ảnh!");
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//       message.error("Ảnh phải nhỏ hơn 2MB!");
//     }
//     return isImage && isLt2M;
//   },
//   maxCount: 1,
//   showUploadList: true,
//   onPreview: handlePreview,
//   onChange: handleImageChange,
//   onRemove: handleRemoveImage,
// };
// const handleImageChange: UploadProps["onChange"] = async (info) => {
//   console.log("handleImageChange called", info);
//   if (info.file.status === "uploading") {
//     console.log("Uploading...");
//     return;
//   }

//   if (info.file.status === "done") {
//     console.log("Upload done", info.file.response);
//     const imageUrl = `${env.apiUrl}${info.file.response?.Data?.imageUrl}`;
//     console.log("Full image URL:", imageUrl);
//     setFileList(info.fileList);
//     setImageUrl(imageUrl);
//     setUrlFile({
//       pictureName: info.file.name,
//       pictureUrl: imageUrl,
//     });
//     setIsUpload(true);
//   }

//   if (info.file.status === "error") {
//     console.log("Upload error", info.file);
//     message.error(
//       `${info.file.name} upload không thành công bạn hãy thử lại`
//     );
//     setFileList((fileList) =>
//       fileList.filter((item) => item.uid !== info.file.uid)
//     );
//     setIsUpload(false);
//   }
// };

// // Hàm xóa ảnh
// const handleRemoveImage = () => {
//   setImageUrl(null);
//   setFileList([]);
// };
