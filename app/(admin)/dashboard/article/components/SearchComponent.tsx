import React, { useEffect } from "react";
import { Button, DatePicker, Form, Input, message,Select } from "antd";
import moment from "moment";
import { futureDate } from "@/utils/util";
import { RedoOutlined, SearchOutlined } from "@ant-design/icons";

const dateFormat = "DD/MM/YYYY";

function SearchComponent({ setOnReload, form, setFixedParams ,setOnResetFilter,productTypeOptions}) {
  const initialValues = {
    fromDate: moment().startOf("day"), // Lấy thời điểm 00:00:00 của ngày hiện tại
    toDate: moment().endOf("day"), // Lấy thời điểm 23:59:59 của ngày hiện tại
    // ...(showType ? { accountType: "ALL" } : {}),
  };

  const search = () => {
    const fromDateValue = form.getFieldValue("fromDate");
    const toDateValue = form.getFieldValue("toDate");

    // Kiểm tra nếu fromDateValue và toDateValue là đối tượng moment
    if (moment.isMoment(fromDateValue) && moment.isMoment(toDateValue)) {

      setFixedParams({
        fromDate: fromDateValue.format(dateFormat),
        toDate: toDateValue.format(dateFormat),
        // ...(showType ? { accountType: form.getFieldValue('accountType') } : {}),
      });
      setOnReload && setOnReload(true);
    } else {
      message.error("Giá trị ngày không hợp lệ");
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
    setFixedParams({
      fromDate: initialValues.fromDate.format(dateFormat),
      toDate: initialValues.toDate.format(dateFormat),
    //   ...(showType ? { accountType: "ALL" } : {})
    });
  }, []);

  const resetFields = () => {
    form.resetFields();
    form.setFieldsValue(initialValues); // Đặt lại giá trị mặc định
    setOnResetFilter(true);
    search();
  };


  return (
    <Form form={form} layout={"vertical"} initialValues={initialValues}>
      <div
   
        className="flex gap-4 justify-center bg-white rounded p-4"
      >
    
       
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <Form.Item
            name="created"
            label="Ngày XB:"
            
            rules={[
              {
                required: true,
                message: "Không để trống Từ ngày",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format={dateFormat}
              disabledDate={(current) => futureDate(current)}
            />
          </Form.Item>
        </div>
        <div style={{ width: "100%", maxWidth: "300px" }}>
      
      <Form.Item
          name="state"
          label="Trạng thái:"
          rules={[
            {
              required: true,
              message: "Không để trống Chọn đối tác",
            },
          ]}
        >
          <Select style={{ width: "100%" }} options={productTypeOptions} />
        </Form.Item>
      </div>
      <div style={{ width: "100%", maxWidth: "300px" }}>
      
      <Form.Item
          name="accountType"
          label="Chuyên mục:"
          rules={[
            {
              required: true,
              message: "Không để trống Chọn đối tác",
            },
          ]}
        >
          <Select style={{ width: "100%" }} options={productTypeOptions} />
        </Form.Item>
      </div>
      <div style={{ width: "100%", maxWidth: "300px" }}>
      
      <Form.Item
          name="accountType"
          label="Từ khóa:"
          rules={[
            {
              required: true,
              message: "Không để trống Chọn đối tác",
            },
          ]}
        >
          
          <Input placeholder="Nhập từ khóa...."/>
        </Form.Item>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginTop:30
        }}
      >
        <Button
          icon={<RedoOutlined />}
          onClick={() => resetFields()}
          style={{ width: "10rem" }}
        >
          Làm mới bộ lọc
        </Button>
        <Button
          type="primary"
          onClick={() => search()}
          style={{ width: "10rem" }}
          icon={<SearchOutlined/>}
        >

          Tìm kiếm
        </Button>
      </div>
      </div>
   
    </Form>
  );
}

export default SearchComponent;
