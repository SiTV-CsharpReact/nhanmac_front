"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Upload, message, Tooltip } from "antd";
import Image from "next/image";
import TitlePageAdmin from "@/components/share/TitlePageAdmin";
import { Post } from "@/types/contentItem";
import { fetchPost, updateSlideOrder, updateContent } from "@/modules/admin/slideApi";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import toast from "react-hot-toast";
import { EditIcon } from "@/components/icons/Icons";
import dayjs from "dayjs";
import { UploadOutlined, EyeOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { getBase64 } from "@/utils/util";
import { env } from "@/config/env";
import '@ant-design/v5-patch-for-react-19';

interface SortableRowProps {
  id: string;
  children: React.ReactNode;
}

function SortableRow({ id, children }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isDragging ? "#fafafa" : undefined,
    boxShadow: isDragging ? "0 4px 8px rgba(0,0,0,0.15)" : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
    // Không gán listeners cho toàn bộ <tr> để tránh chặn click các nút
    // listeners sẽ được gán riêng cho cột handle bên dưới
    >
      {React.Children.map(children, (child, index) => {
        if (index === 0) {
          // Gán listeners và style cursor cho cột handle (cột kéo thả)
          return React.cloneElement(child as React.ReactElement, {
            ...listeners,
            style: {
              cursor: "grab",
              userSelect: "none",
              ...child.props.style,
            },
          });
        }
        return child;
      })}
    </tr>
  );
}

const AdminPostManagement: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Post | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchPost();
      if (response.Code === 200 && response.Data) {
        setPosts(response.Data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = posts.findIndex((item) => String(item.id) === String(active.id));
      const newIndex = posts.findIndex((item) => String(item.id) === String(over.id));
      const newItems = arrayMove(posts, oldIndex, newIndex);
      setPosts(newItems);
      toast.success("Sắp xếp thành công!");
    }
  };

  const handleSaveOrder = async () => {
    setLoading(true);
    try {
      const orderedIds = posts.map((post) => post.id);
      const response = await updateSlideOrder(orderedIds);
      if (response.Code === 200) {
        toast.success("Lưu thứ tự thành công!");
      } else {
        toast.error("Lỗi khi lưu thứ tự: " + response.Message);
      }
    } catch (error: any) {
      console.error("Lỗi khi gọi API lưu thứ tự:", error);
      toast.error("Lỗi khi lưu thứ tự: " + error.message);
    }
    setLoading(false);
  };

  const showModal = (record: Post) => {
    setEditingRecord(record);
    form.setFieldsValue({
      title: record.title,
      image_desc: record.image_desc,
    });
    if (record.urls) {
      setFileList([
        {
          uid: '-1',
          name: record.images || 'image',
          status: 'done',
          url: record.urls,
        }
      ]);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
    setEditingRecord(null);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const uploadProps = {
    name: 'file',
    action: `${env.apiUrl}/upload/image`,
    accept: 'image/*',
    listType: 'picture-card',
    fileList,
    onPreview: handlePreview,
    onChange: handleChange,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ được upload file ảnh!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Ảnh phải nhỏ hơn 5MB!');
      }
      return isImage && isLt5M;
    },
    maxCount: 1,
  };

  const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: rowId });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: "grab",
      padding: "0 8px",
      fontSize: 18,
      lineHeight: 1,
      backgroundColor: isDragging ? "#f5f5f5" : undefined,
    };

    return (
      <Tooltip title="Giữ chuột kéo thả">
        <span
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={style}
          title="Kéo thả để sắp xếp"
        >
          &#8942;&#8942;
        </span>
      </Tooltip>

    );
  }
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!editingRecord) return;

      const formData = {
        ...values,
        urls: fileList[0]?.response?.Data?.imageUrl || fileList[0]?.url,
        images: fileList[0]?.name,
        image: ''
      };

      const response = await updateContent(editingRecord.id, formData);
      if (response.Code === 200) {
        message.success("Cập nhật thành công!");
        handleCancel();
        fetchData();
      } else {
        message.error(response.Message || "Cập nhật thất bại!");
      }
    } catch (error: any) {
      console.error("Lỗi khi cập nhật:", error);
      message.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

  const columns = [
    {
      title: "Sắp xếp",
      dataIndex: "sort",
      width: 80,
      align: "center",
      render: (_: any, record: Post) => (
        <RowDragHandleCell rowId={record.id.toString()} />
      )
    },
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Tiêu đề", dataIndex: "title", key: "title", ellipsis: true },
    {
      title: "Ảnh",
      dataIndex: "urls",
      key: "urls",
      render: (urls: string, record: Post) =>
        urls && (
          <div className="relative group">
            <Image src={urls} width={100} height={50} alt="Ảnh" />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2">
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  setPreviewImage(urls);
                  setPreviewTitle(record.title || 'Xem ảnh');
                  setPreviewOpen(true);
                }}
              >
              </Button>
              {/* <Button 
                type="primary" 
                size="small"
                onClick={() => showModal(record)}
              >
                Sửa
              </Button> */}
            </div>
          </div>
        ),
    },
    {
      title: "Chú thích ảnh",
      dataIndex: "image_desc",
      key: "image_desc",
      width: 300,
    },
    {
      title: "Ngày tạo",
      dataIndex: "created",
      key: "created",
      width: 160,
      render: (date: string | Date) => (
        <span>{dayjs(date).format("DD/MM/YYYY HH:mm:ss")}</span>
      ),
    },
    {
      title: "Link",
      dataIndex: "alias",
      key: "image_desc",
      width: 350,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 88,
      align: "center",
      render: (_: any, record: Post) => (
        <div className="flex justify-center">
          <Button
            type="text"
            icon={<EditIcon />}
            onClick={(e) => {
              e.stopPropagation(); // Ngăn kéo thả khi click nút
              showModal(record);
            }}
            title="Sửa menu"
          />
        </div>
      ),
    },
  ];

  // Wrapper tbody với SortableContext
  const DraggableContainer = (props: any) => (
    <SortableContext
      items={posts.map((item) => String(item.id))}
      strategy={verticalListSortingStrategy}
    >
      <tbody {...props} />
    </SortableContext>
  );

  // Wrapper row dùng useSortable
  const DraggableBodyRow = (props: any) => {
    const { "data-row-key": rowKey, children } = props;
    return <SortableRow id={String(rowKey)}>{children}</SortableRow>;
  };

  return (
    <div className="px-3">
      <div className="p-2 bg-white rounded flex justify-between items-center">
        <TitlePageAdmin text={"Quản lý slide"} />
        <Button type="primary" onClick={handleSaveOrder} loading={loading} className="!bg-[#2f80ed]">
          Lưu thứ tự
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table
          // className="mt-3"
          rowKey="id"
          columns={columns}
          dataSource={posts}
          loading={loading}
          pagination={false}
          scroll={{ x: true }}
          className="mt-3 [&_.ant-table-cell]:!p-2"
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
      </DndContext>

      <Modal
        title="Sửa slide"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        styles={{ body: { paddingBottom: 8, padding: 16 }, footer: { padding: 16 } }}

      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingRecord || {}}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ảnh"
            name="image"
          >
            <Upload {...uploadProps}>
              {fileList.length === 0 && <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>}
            </Upload>
          </Form.Item>
          <Form.Item
            name="image_desc"
            label="Chú thích ảnh"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="alias"
            label="Link"
            rules={[{ required: true, message: 'Vui lòng nhập đường link bài viết!' }]}
          >
            <Input  />
          </Form.Item>
         
        </Form>
      </Modal>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        styles={{ body: { paddingBottom: 8, padding: 16 } }}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default AdminPostManagement;
