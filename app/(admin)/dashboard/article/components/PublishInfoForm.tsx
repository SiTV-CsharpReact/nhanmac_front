import React from "react";
import { Form, DatePicker, TimePicker, Select, Collapse, Tooltip } from "antd";
import { CalendarOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Panel } = Collapse;

export default function PublishInfoForm({ form, initialValues }) {
  return (
    <Collapse defaultActiveKey={['1']} style={{ marginBottom: 24 }}>
      <Panel
        header={
          <span>
            <CalendarOutlined style={{ marginRight: 8, color: "#52c41a" }} />
            Thông tin xuất bản
          </span>
        }
        key="1"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
        >
          <Form.Item
            label="Ngày giờ xuất bản"
            name="publishDate"
            rules={[{ required: true, message: "Chọn ngày xuất bản!" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              placeholder="Chọn ngày xuất bản"
            />
          </Form.Item>

          <Form.Item
            label="Chọn giờ thủ công"
            name="publishTime"
            rules={[{ required: true, message: "Chọn giờ xuất bản!" }]}
            tooltip={{
              title: "Chọn giờ xuất bản bài viết",
              icon: <InfoCircleOutlined />,
            }}
          >
            <TimePicker
              use12Hours
              format="h:mm:ss A"
              style={{ width: "100%" }}
              placeholder="Chọn giờ xuất bản"
            />
          </Form.Item>

          <Form.Item
            label="Chuyên mục chính"
            name="mainCategory"
            rules={[{ required: true, message: "Chọn chuyên mục chính!" }]}
          >
            <Select placeholder="Chọn chuyên mục chính">
              <Option value="tour-noi-bat">Tour &gt;&gt; Nổi bật</Option>
              <Option value="tour-trong-nuoc">Tour &gt;&gt; Trong nước</Option>
              <Option value="tour-nuoc-ngoai">Tour &gt;&gt; Nước ngoài</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Chuyên mục phụ"
            name="subCategories"
          >
            <Select
              mode="multiple"
              placeholder="Chọn chuyên mục phụ"
              allowClear
            >
              <Option value="tour-hot">Tour &gt;&gt; Hot</Option>
              <Option value="tour-sale">Tour &gt;&gt; Sale</Option>
              <Option value="tour-vip">Tour &gt;&gt; VIP</Option>
            </Select>
          </Form.Item>
        </Form>
      </Panel>
    </Collapse>
  );
}
