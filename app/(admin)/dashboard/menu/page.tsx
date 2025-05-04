'use client'
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, notification, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuItem } from "@/types/MenuItem";
import { fetchMenus, addMenu, editMenu, deleteMenu } from "@/utils/admin/menuApi";
import 'antd/dist/reset.css';
// Hàm chuyển flat array sang tree
function buildMenuTree(data: MenuItem[], parent = 0): MenuItem[] {
    return data
        .filter(item => item.parent === parent)
        .sort((a, b) => a.ordering - b.ordering)
        .map(item => {
            const children = buildMenuTree(data, item.id);
            return {
                ...item,
                key: item.id,
                children: children.length > 0 ? children : undefined, // chỉ set children nếu có con
            };
        });
}

const columns = (
    onEdit: (record: MenuItem) => void,
    onDelete: (id: number) => void,
    onAddSub: (parent: MenuItem) => void
): ColumnsType<MenuItem> => [
        {
            title: "Menu",
            dataIndex: "name",
            key: "name",
            render: (text: string) => <span className="font-medium">{text}</span>
        },
        {
            title: "Đường dẫn",
            dataIndex: "link",
            key: "link",
            render: (link: string) => (
                <span className="text-blue-600 underline uppercase">{link}</span>
            )
        },
        {
            title: "Số thứ tự",
            // dataIndex: "ordering",
            // key: "ordering",
            align: "center",
            render: (_, record) => (
                <span className={`border ${record?.parent === 0 ? `border-violet-400 text-violet-500` : `border-red-400 text-red-500`}  rounded px-3 py-1 `}>{record?.ordering}</span>
            )
        },

        {
            title: "Hành động",
            key: "action",
            align: "center",
            width: 160,
            render: (_, record) => {
                if (record?.name === 'TRANG CHỦ') {
                    // Không hiển thị gì nếu là "TRANG CHỦ"
                    return null;
                }
                return (

                    <div className="flex justify-center space-x-3">
                        {record?.parent === 0 ?
                            <Button
                                type="text"
                                icon={<PlusCircleOutlined className="text-green-500" />}
                                title="Thêm menu con"
                                onClick={() => onAddSub(record)}
                            /> : <div style={{ width: 20 }}></div>}

                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                            title="Sửa menu"
                        />
                        <Popconfirm
                            title={`Bạn có chắc muốn xóa menu "${record.name}"?`}
                            onConfirm={() => onDelete(record.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <Button
                                type="text"
                                icon={<DeleteOutlined className="text-red-500" />}
                                title="Xóa menu"
                            />
                        </Popconfirm>
                    </div>
                )
            }


        }
    ];

export default function MenuManager() {
    const [menuData, setMenuData] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
    const [addSubForm] = Form.useForm();
    const [parentForSub, setParentForSub] = useState<MenuItem | null>(null);
    const [addSubModalOpen, setAddSubModalOpen] = useState(false);
    // Load menu
    const loadMenus = async () => {
        setLoading(true);
        try {
            const data = await fetchMenus();
            setMenuData(data);
        } catch (e: any) {
            notification.error({ message: "Lỗi", description: e.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMenus();
    }, []);



    // Thêm menu
    const handleAddSubMenu = async (values: any) => {
        if (!parentForSub) return;
        try {
            await addMenu({
                name: values.name,
                alias: values.name.toLowerCase().replace(/\s+/g, "-"),
                link: values.link,
                menutype: "mainmenu",
                parent: parentForSub.id, // Gán parent là id menu cha
                ordering: Number(values.ordering),
                published: 1
            });
            notification.success({ message: "Thành công", description: "Đã thêm menu con!" });
            setAddSubModalOpen(false);
            addSubForm.resetFields();
            setParentForSub(null);
            loadMenus();
        } catch (e: any) {
            notification.error({ message: "Lỗi", description: e.message });
        }
    };

    const handleAddMenu = async (values: any) => {
        try {
            await addMenu({
                name: values.name,
                alias: values.name.toLowerCase().replace(/\s+/g, "-"),
                link: values.link,
                menutype: "mainmenu",
                parent: 0, // Gán parent là id menu cha
                ordering: Number(values.ordering),
                published: 1
            });
            notification.success({ message: "Thành công", description: "Đã thêm menu con!" });
            setAddSubModalOpen(false);
            addSubForm.resetFields();
            setParentForSub(null);
            loadMenus();
        } catch (e: any) {
            notification.error({ message: "Lỗi", description: e.message });
        }
    };

    // Mở popup sửa menu
    const openEditModal = (menu: MenuItem) => {
        setEditingMenu(menu);
        setParentForSub(menu);
        editForm.setFieldsValue({
            name: menu.name,
            link: menu.link,
            ordering: menu.ordering
        });
        setEditModalOpen(true);
    };

    // Sửa menu
    const handleEditMenu = async (values: any) => {
        if (!editingMenu) return;
        try {
            await editMenu(editingMenu.id, {
                name: values.name,
                alias: values.name.toLowerCase().replace(/\s+/g, "-"),
                link: values.link,
                menutype: "mainmenu",
                parent: 0,
                ordering: Number(values.ordering),
                published: 1
            });
            notification.success({ message: "Thành công", description: "Đã sửa menu!" });
            setEditModalOpen(false);
            setEditingMenu(null);
            editForm.resetFields();
            loadMenus();
        } catch (e: any) {
            notification.error({ message: "Lỗi", description: e.message });
        }
    };



    // Xóa menu
    const handleDeleteMenu = async (id: number) => {
        try {
            await deleteMenu(id);
            notification.success({ message: "Thành công", description: "Đã xóa menu!" });
            loadMenus();
        } catch (e: any) {
            notification.error({ message: "Lỗi", description: e.message });
        }
    };

    const openAddSubModal = (parent: MenuItem) => {
        setParentForSub(parent);
        addSubForm.setFieldsValue({
            name: "",
            link: "",
            ordering: 1
        });
        setAddSubModalOpen(true);
    };

    const rowClassName = (record: MenuItem) => {
        if (record.parent === 0) {
            return ""; // menu cha mặc định
        }
        // menu con cấp 1 (parent != 0)
        return "bg-gray-50"; // ví dụ màu nền sáng hơn
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Quản lý menu</h2>
                <Button
                    // type="primary"
                    icon={<PlusOutlined />}
                    className="bg-[#7367F0] hover:bg-violet-600"
                    onClick={() => setModalOpen(true)}
                    style={{ background: '#7367F0', color: 'white' }}
                >
                    Thêm mới
                </Button>
            </div>

            <Table<MenuItem>
                columns={columns(openEditModal, handleDeleteMenu, openAddSubModal)}
                dataSource={buildMenuTree(menuData)}
                pagination={false}
                expandable={{ expandRowByClick: true, indentSize: 24 }}
                loading={loading}
                className="border rounded"
                rowClassName={rowClassName}
            />

            {/* Modal Thêm mới */}
            <Modal
                title="Thêm mới menu"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleAddMenu} initialValues={{ ordering: 1 }}>
                    <Form.Item name="name" label="Tên menu" rules={[{ required: true, message: "Nhập tên menu!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="link" label="Đường dẫn" rules={[{ required: true, message: "Nhập đường dẫn!" }]}>
                        <Input addonBefore="products/" />
                    </Form.Item>
                    <Form.Item name="ordering" label="Số thứ tự" rules={[{ required: true, message: "Nhập số thứ tự!" }]}>
                        <Input type="number" min={1} />
                    </Form.Item>
                    <div className="flex justify-end space-x-2 mt-2 gap-2">
                        <Button onClick={() => setModalOpen(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" className="bg-violet-500 hover:bg-violet-600 ml-2">Lưu</Button>
                    </div>
                </Form>
            </Modal>

            {/* Modal Sửa menu */}
            <Modal
                title="Sửa menu"
                open={editModalOpen}
                onCancel={() => setEditModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={editForm} layout="vertical" onFinish={handleEditMenu}>
                    <Form.Item name="name" label="Tên menu" rules={[{ required: true, message: "Nhập tên menu!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="link" label="Đường dẫn" rules={[{ required: true, message: "Nhập đường dẫn!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="ordering" label="Số thứ tự" rules={[{ required: true, message: "Nhập số thứ tự!" }]}>
                        <Input type="number" min={1} />
                    </Form.Item>
                    <div className="flex justify-end space-x-2 mt-2 gap-2">
                        <Button onClick={() => setEditModalOpen(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" className="bg-violet-500 hover:bg-violet-600 ml-2">Lưu</Button>
                    </div>
                </Form>
            </Modal>
            <Modal
                title={parentForSub ? `Thêm menu con cho "${parentForSub.name}"` : "Thêm menu con"}
                open={addSubModalOpen}
                onCancel={() => setAddSubModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={addSubForm} layout="vertical" onFinish={handleAddSubMenu} initialValues={{ ordering: 1 }}>
                    <Form.Item name="name" label="Tên menu" rules={[{ required: true, message: "Nhập tên menu!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="link" label="Đường dẫn" rules={[{ required: true, message: "Nhập đường dẫn!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="ordering" label="Số thứ tự" rules={[{ required: true, message: "Nhập số thứ tự!" }]}>
                        <Input type="number" min={1} />
                    </Form.Item>
                    <div className="flex justify-end space-x-2 mt-2 gap-2">
                        <Button onClick={() => setAddSubModalOpen(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" className="bg-violet-500 hover:bg-violet-600 ml-2">Lưu</Button>
                    </div>
                </Form>
            </Modal>

        </div>
    );
}
