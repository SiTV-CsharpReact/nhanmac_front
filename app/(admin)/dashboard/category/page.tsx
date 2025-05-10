"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Select, Dropdown, Menu, message, Form, Tooltip, Popconfirm } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { categoryApi } from '@/modules/admin/categoryApi';
import { Categories, Category } from "@/types/categoryItem";
import { debounce } from 'lodash';
import TitlePageAdmin from "@/components/share/TitlePageAdmin";
import { DeleteIcon, EditIcon } from "@/components/icons/Icons";
import { useCategories } from "@/hooks/useCategories";
const { Option } = Select;
import '@ant-design/v5-patch-for-react-19';
// console.log(React.version);
// Hàm chuyển mảng phẳng thành tree

function buildTree(data: Categories[]): any[] {
  const sectionMap = new Map<number, any>();

  data.forEach(item => {
    // Nếu là mục Section (cha)
    if (!sectionMap.has(item.section_id)) {
      sectionMap.set(item.section_id, {
        key: `section-${item.section_id}`,
        id: `${item.section_id}`,
        title: item.section_title,
        alias: item.alias_parent,
        published: 1,
        parent_id: 0,
        children: [],
      });
    }

    // Nếu là category, push vào đúng section
    if (item.category_id) {
      sectionMap.get(item.section_id).children.push({
        key: `category-${item.category_id}`,
        id: item.category_id,
        title: item.category_title,
        alias: item.alias,
        published: 1,
        parent_id: item.parent_id,
      });
    }
  });

  return Array.from(sectionMap.values());
}




// const rowClassName = (record: Categories) => {
//   // console.log(first)
//   if (record?.alias) {
//     return "bg-gray-50"; // menu cha mặc định
//   }
//   // menu con cấp 1 (parent != 0)
//   // return "bg-gray-50"; // ví dụ màu nền sáng hơn
// };
export default function CategoryTable() {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categories | null>(null);
  const [form] = Form.useForm();
  const { selectOptions, loading } = useCategories();
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAllSection();
      setCategories(data?.Data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const showModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue({
        name: category.name,
        title: category.title,
        alias: category.alias,
        parent_id: category.parent_id,
        published: category.published,
      });
    } else {
      setEditingCategory(null);
      form.resetFields();
      form.setFieldsValue({
        parent_id: 0,
        published: 1
      });
    }
    setIsModalOpen(true);
  };

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const categoryData = {
        name: values.name,
        title: values.title,
        alias: values.alias || removeVietnameseTones(values.title),
        section: values.parent_id || 0,
        published: values.published,
      };

      if (editingCategory) {
        await categoryApi.update(editingCategory.id, categoryData);
        message.success("Chuyên mục đã được cập nhật");
      } else {
        await categoryApi.create(categoryData);
        message.success("Chuyên mục đã được thêm mới");
      }

      fetchCategories();
      setIsModalOpen(false);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryApi.delete(id);
      fetchCategories();
      message.success("Chuyên mục đã được xóa");
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", align: 'center', width: 100, },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Alias", dataIndex: "alias", key: "alias" },
    {
      title: "Trạng thái",
      dataIndex: "published",
      key: "published",
      render: (published: number) => (published === 1 ? "Đã xuất bản" : "Chưa xuất bản"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 80,
      render: (_: any, record: Category) => (
        <div className="flex gap-5">
          <div onClick={(e) => {
             e?.stopPropagation();
            showModal(record)}}>
            <EditIcon
            />
          </div>
          <Tooltip title="Xóa">
        <Popconfirm
            title={`Bạn có chắc muốn xóa "${record.title}"?`}
            onConfirm={(e) => {
              e?.stopPropagation(); // Ngăn sự kiện lan ra ngoài
              handleDelete(record.id);
            }}
            onCancel={(e) => {
              e?.stopPropagation(); // Ngăn sự kiện lan ra ngoài
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              icon={<DeleteIcon className="text-red-500" />}
              title="Xóa menu"
              onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan ra ngoài khi bấm nút
            />
          </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Tạo hàm debounce với useCallback để tránh recreate function mỗi lần render
  const debouncedUpdateAlias = debounce((title: string) => {
    const currentAlias = form.getFieldValue('alias');
    if (!currentAlias?.trim()) {
      form.setFieldsValue({ alias: removeVietnameseTones(title) });
    }
  }, 500);

  // Cleanup vẫn cần thiết
  useEffect(() => {
    return () => debouncedUpdateAlias.cancel();
  }, []);

  return (
    <div className="pl-4">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, background: 'white', padding: 6, borderRadius: 5 }}>
        <TitlePageAdmin text={'Quản lý chuyên mục'} />

        <Button
          // type="primary"
          icon={<PlusOutlined />}
          className="bg-[#7367F0] hover:bg-violet-600"
          onClick={() => showModal()}
          style={{ background: '#7367F0', color: 'white' }}
        >
          Thêm mới
        </Button>
      </div>

      <Table
        style={{
          width: 900,
          marginTop: 20
        }}
        columns={columns}
        dataSource={buildTree(categories)}
        pagination={false}
        expandable={{ expandRowByClick: true, indentSize: 24 }}
        bordered
        // rowClassName={rowClassName}
        className="[&_.ant-table-cell]:!p-2"
      />

      <Modal
        title={
          <div style={{ textAlign: "center", fontWeight: 600 }}>
            {editingCategory ? "Chỉnh sửa chuyên mục" : "Thêm mới chuyên mục"}
          </div>
        }
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
        styles={{ body: { paddingBottom: 8, padding: 16 } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên chuyên mục"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề chuyên mục" }]}
          >
            <Input
              placeholder="Tiêu đề"
              onChange={(e) => debouncedUpdateAlias(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Alias" name="alias">
            <Input placeholder="Alias (để trống sẽ tự động tạo)" />
          </Form.Item>

          <Form.Item label="Danh mục cha" name="parent_id">
            <Select
              allowClear
              options={selectOptions}
              placeholder="-- Chọn danh mục cha --"
            />
          </Form.Item>


          <Form.Item label="Trạng thái xuất bản" name="published">
            <Select>
              <Option value={1}>Đã xuất bản</Option>
              <Option value={0}>Chưa xuất bản</Option>
            </Select>
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <Button
              onClick={handleSave}
              type="primary"
              style={{ borderRadius: 6, minWidth: 80 }}
            >
              Lưu
            </Button>
            <Button
              onClick={() => setIsModalOpen(false)}
              danger
              style={{ borderRadius: 6, minWidth: 80 }}
            >
              Hủy
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
