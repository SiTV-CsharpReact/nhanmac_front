'use client'
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message } from 'antd';
import Image from 'next/image';
import TitlePageAdmin from '@/components/share/TitlePageAdmin';
import { Post } from '@/types/contentItem';
import { fetchPost } from '@/modules/admin/slideApi';
import { updateSlideOrder } from '@/modules/admin/slideApi'; // API lưu thứ tự

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isDragging ? '#fafafa' : undefined,
    boxShadow: isDragging ? '0 4px 8px rgba(0,0,0,0.15)' : undefined,
    cursor: 'grab',
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </tr>
  );
}

const AdminPostManagement: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

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
      console.error('Error fetching data:', error);
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDelete = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    message.success('Đã xóa bài viết!');
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = posts.findIndex((item) => String(item.id) === String(active.id));
      const newIndex = posts.findIndex((item) => String(item.id) === String(over.id));
      const newItems = arrayMove(posts, oldIndex, newIndex);
      setPosts(newItems);
      message.success('Sắp xếp thành công!');
    }
  };

  // Hàm lưu thứ tự mới
  const handleSaveOrder = async () => {
    setLoading(true);
    try {
      // Lấy danh sách ID theo thứ tự mới
      const orderedIds = posts.map(post => post.id);

      // Gọi API
      const response = await updateSlideOrder(orderedIds);

      if (response.Code === 200) {
        message.success('Lưu thứ tự thành công!');
      } else {
        message.error('Lỗi khi lưu thứ tự: ' + response.Message);
      }
    } catch (error: any) {
      console.error('Lỗi khi gọi API lưu thứ tự:', error);
      message.error('Lỗi khi lưu thứ tự: ' + error.message);
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'Sắp xếp',
      dataIndex: 'sort',
      width: 90,
      align: 'center',
      render: () =>  <span
      style={{
        cursor: 'grab',
        fontSize: 18,
        userSelect: 'none',
        lineHeight: 1,
        display: 'inline-block',
        padding: '0 4px',
      }}
      aria-label="Kéo thả"
      title="Kéo thả"
    >
      &#8942;&#8942;
    </span>,
    },
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', ellipsis: true },
    {
      title: 'Ảnh',
      dataIndex: 'urls',
      key: 'alias',
      render: (_: any) => <Image src={_} width={100} height={50} alt="" />,
    },
    {
      title: 'Chú thích ảnh',
      dataIndex: 'image_desc',
      key: 'image_desc',
      width: 200,
    },
    { title: 'Ngày tạo', dataIndex: 'created', key: 'created', width: 300 },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: any, record: Post) => (
        <Space>
          <Button type="link">Sửa</Button>
          <Button type="link" danger onClick={() => onDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Tạo body wrapper để dùng SortableContext
  const DraggableContainer = (props: any) => {
    return (
      <SortableContext items={posts.map((item) => String(item.id))} strategy={verticalListSortingStrategy}>
        <tbody {...props} />
      </SortableContext>
    );
  };

  // Tạo row wrapper để dùng useSortable
  const DraggableBodyRow = (props: any) => {
    const { 'data-row-key': rowKey, children, ...restProps } = props;
    return (
      <SortableRow id={String(rowKey)}>
        {children}
      </SortableRow>
    );
  };

  return (
    <div className="px-3">
      <div className="p-2 bg-white rounded flex justify-between items-center">
        <TitlePageAdmin text={'Quản lý slide'} />
        <Button type="primary" onClick={handleSaveOrder} loading={loading}>
          Lưu thứ tự
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Table
          className="mt-3"
          rowKey="id"
          columns={columns}
          dataSource={posts}
          loading={loading}
          pagination={false}
          scroll={{ x: true }}
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
      </DndContext>
    </div>
  );
};

export default AdminPostManagement;
