import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, message, Select } from "antd";
import moment from "moment";
import { futureDate } from "@/utils/util";
import { RedoOutlined, SearchOutlined } from "@ant-design/icons";

const dateFormat = "DD/MM/YYYY";

const { RangePicker } = DatePicker;

interface SearchComponentProps {
  setOnReload?: (value: boolean) => void;
  form: any;
  setFixedParams: (params: any) => void;
  setOnResetFilter?: (value: boolean) => void;
  productTypeOptions: { label: string; value: string }[];
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  setOnReload,
  form,
  setFixedParams,
  setOnResetFilter,
  productTypeOptions,
}) => {
  const initialValues = {
    created: [moment().startOf("day"), moment().endOf("day")], // RangePicker expects array of moments
    state: undefined,
    category: undefined,
    keyword: "",
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
    // Khởi tạo fixedParams với giá trị mặc định (chuyển ngày sang chuỗi DD/MM/YYYY)
    setFixedParams({
      createdFrom: initialValues.created[0].format(dateFormat),
      createdTo: initialValues.created[1].format(dateFormat),
      state: undefined,
      category: undefined,
      keyword: "",
    });
  }, []);

  const search = () => {
    const { created, state, category, keyword } = form.getFieldsValue();
  
    if (
      Array.isArray(created) &&
      created.length === 2 &&
      moment.isMoment(created[0]) &&
      moment.isMoment(created[1])
    ) {
      setFixedParams({
        createdFrom: created[0].format(dateFormat),
        createdTo: created[1].format(dateFormat),
        state,
        category,
        keyword,
      });
      setOnReload && setOnReload(true);
    } else {
      message.error("Giá trị ngày không hợp lệ");
    }
  };

  const resetFields = () => {
    form.resetFields();
    form.setFieldsValue(initialValues);
    setOnResetFilter && setOnResetFilter(true);
    search();
  };

  return (
    <Form form={form} layout={"vertical"} initialValues={initialValues}>
      <div className="flex gap-4 justify-center bg-white rounded p-4">
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <Form.Item name="created" label="Ngày XB:">
            <RangePicker
              style={{ width: "100%" }}
              format={dateFormat}
              disabledDate={(current) => futureDate(current)}
            />
          </Form.Item>
        </div>

        <div style={{ width: "100%", maxWidth: "300px" }}>
          <Form.Item name="state" label="Trạng thái:">
            <Select style={{ width: "100%" }} options={productTypeOptions} defaultValue={1} allowClear />
          </Form.Item>
        </div>

        <div style={{ width: "100%", maxWidth: "300px" }}>
          <Form.Item name="category" label="Chuyên mục:">
            <Select style={{ width: "100%" }} options={productTypeOptions} allowClear />
          </Form.Item>
        </div>

        <div style={{ width: "100%", maxWidth: "300px" }}>
          <Form.Item name="keyword" label="Từ khóa:">
            <Input placeholder="Nhập từ khóa..." allowClear />
          </Form.Item>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 30,
            width: "100%",
          }}
        >
          <Button
            icon={<RedoOutlined />}
            onClick={resetFields}
            style={{ width: "10rem" }}
          >
            Làm mới bộ lọc
          </Button>
          <Button
            type="primary"
            onClick={search}
            style={{ width: "10rem" }}
            icon={<SearchOutlined />}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default SearchComponent;
