'use client'
import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag, Tooltip } from 'antd';
import { Post } from '@/types/contentItem';

const AdminPostManagement: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3600/api/contents')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
      })
      .catch(() => message.error('Không lấy được dữ liệu bài viết!'))
      .finally(() => setLoading(false));
  }, []);

  const onDelete = (id: number) => {
    // Gọi API xóa nếu có, ở đây chỉ xóa trên UI
    setPosts(prev => prev.filter(p => p.id !== id));
    message.success('Đã xóa bài viết!');
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: 'Alias', dataIndex: 'alias', key: 'alias', ellipsis: true },
    {
        title: 'Danh mục',
        dataIndex: 'metakey',
        key: 'metakey',
        width: 200,
        ellipsis: true, // giúp ẩn text dài trong cell
       render: (text: string) => {
  const tags = text ? text.split('|').map(t => t.trim()) : [];
  const maxTagCount = 3;
  const displayTags = tags.slice(0, maxTagCount);
  const moreCount = tags.length - maxTagCount;

  return (
    <Tooltip title={text}>
      <div
        style={{
          maxHeight: 48,
          overflow: 'hidden',
          whiteSpace: 'normal',
        }}
      >
        {displayTags.map((tag, idx) => (
          <Tag color="blue" key={idx} style={{ marginBottom: 4 }}>
            {tag}
          </Tag>
        ))}
        {moreCount > 0 && <Tag>+{moreCount} thêm</Tag>}
      </div>
    </Tooltip>
  );
}

      }
,      
    { title: 'Trạng thái', dataIndex: 'state', key: 'state', width: 100,
      render: (state: number) => (
        <Tag color={state === 1 ? 'green' : 'red'}>
          {state === 1 ? 'Hiển thị' : 'Ẩn'}
        </Tag>
      ),
    },
    { title: 'Ngày tạo', dataIndex: 'created', key: 'created', width: 160 },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: any, record: Post) => (
        <Space>
          <Button type="link">Sửa</Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => onDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản trị bài viết</h2>
      <Button type="primary" style={{ marginBottom: 16 }}>
        Thêm bài viết mới
      </Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={posts}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default AdminPostManagement;
