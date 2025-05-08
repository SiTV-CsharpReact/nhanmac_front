import React from "react";
import { Form, DatePicker, TimePicker, Select, Collapse, Tooltip } from "antd";
import { CalendarOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useCategories } from "@/hooks/useCategories";
import dayjs from "dayjs";

const { Option } = Select;
const { Panel } = Collapse;

export default function PublishInfoForm() {
  const { selectOptions, loading } = useCategories();
  return (
    <Collapse defaultActiveKey={['1']} style={{ marginBottom: 14 }}>
      <Panel
        header={
          <span>
            <CalendarOutlined style={{ marginRight: 8, color: "#52c41a" }} />
            Thông tin xuất bản
          </span>
        }
        key="1"
      >
        {/* KHÔNG dùng <Form> ở đây, chỉ dùng Form.Item */}
        <Form.Item
          label="Ngày giờ xuất bản"
          name="publish_up"
        // rules={[{ required: true, message: "Chọn ngày xuất bản!" }]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm:ss' }} // Thêm dòng này để chọn giờ:phút
            format="DD/MM/YYYY HH:mm:ss"      // Định dạng hiển thị cả ngày và giờ
            style={{ width: "100%" }}
            placeholder="Chọn ngày giờ xuất bản"
            defaultValue={dayjs()}
          />
        </Form.Item>

        <Form.Item name="catid" label="Chuyên mục:">
          <Select
            showSearch
            loading={loading}
            placeholder="Chọn chuyên mục"
            options={selectOptions}
            filterOption={(input, option) =>
              (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
            style={{ width: '100%' }}
            allowClear
          />
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
      </Panel>
    </Collapse>
  );
}
