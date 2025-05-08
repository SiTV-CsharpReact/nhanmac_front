"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Select, Dropdown, Menu, message, Form } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { categoryApi } from '@/modules/admin/categoryApi';
import { Category } from "@/types/categoryItem";
import { debounce } from 'lodash';
import TitlePageAdmin from "@/components/share/TitlePageAdmin";
const { Option } = Select;
// console.log(React.version);
// Hàm chuyển mảng phẳng thành tree
function buildTree(data: Category[], parentId = 0): any[] {
  return data
    .filter(item => item.parent_id === parentId)
    .sort((a, b) => a.id - b.id)
    .map(item => {
      const children = buildTree(data, item.id);
      return {
        ...item,
        key: item.id,
        children: children.length > 0 ? children : undefined, // chỉ set children nếu có con
      };
    })
  // .sort((a, b) => (a.ordering || 0) - (b.ordering || 0));
}



const rowClassName = (record: Category) => {
  if (record.parent_id === 0) {
    return ""; // menu cha mặc định
  }
  // menu con cấp 1 (parent != 0)
  return "bg-gray-50"; // ví dụ màu nền sáng hơn
};
export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data.Data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const renderMenu = (category: Category) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => showModal(category)}>Sửa</Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(category.id)}>Xóa</Menu.Item>
    </Menu>
  );

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
        parent_id: values.parent_id || 0,
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
    { title: "ID", dataIndex: "id", key: "id", },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Alias", dataIndex: "alias", key: "alias" },
    {
      title: "Trạng thái",
      dataIndex: "published",
      key: "published",
      render: (published: number) => (published === 1 ? "Đã xuất bản" : "Chưa xuất bản"),
    },
    {
      title: "",
      key: "action",
      width: 80,
      render: (_: any, record: Category) => (
        <Dropdown overlay={renderMenu(record)} trigger={["click"]}>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16,background:'white',padding:6,borderRadius:5 }}>
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
        columns={columns}
        dataSource={buildTree(categories)}
        pagination={false}
        expandable={{ expandRowByClick: true, indentSize: 24 }}
        bordered
        rowClassName={rowClassName}
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
        styles={{ body: { paddingBottom: 8 } }}
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
            <Select allowClear>
              <Option value={0}>-- Không có --</Option>
              {categories.filter(c => c.parent_id === 0 && c.published !== 0).map(c => (
                <Option key={c.id} value={c.id}>{c.title}</Option>
              ))}
            </Select>
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
