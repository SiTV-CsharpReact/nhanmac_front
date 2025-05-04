import React from 'react';
import { Form, Input, Collapse } from 'antd';

const { TextArea } = Input;
const { Panel } = Collapse;

export default function MetadataForm({ form, initialValues }) {
  return (
    <Collapse defaultActiveKey={['1']} style={{ marginBottom: 24 }}>
      <Panel header="Thông tin Metadata" key="1">
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
        >
          <Form.Item label="Sự miêu tả" name="description">
            <TextArea rows={3} placeholder="Nhập sự miêu tả..." />
          </Form.Item>
          <Form.Item label="Từ khóa" name="keywords">
            <TextArea rows={3} placeholder="Nhập từ khóa..." />
          </Form.Item>
          <Form.Item label="Robots" name="robots">
            <Input placeholder="Robots" />
          </Form.Item>
          <Form.Item label="Tác giả" name="author">
            <Input placeholder="Tác giả" />
          </Form.Item>
        </Form>
      </Panel>
    </Collapse>
  );
}
