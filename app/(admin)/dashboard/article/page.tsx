"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Tooltip, Form, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { dateFormat, statusXB } from "@/config/config";
import { formatMoney, getConstantLabel, getTagColor } from "@/utils/util";
import moment from "moment";
import { FileSearchOutlined } from "@ant-design/icons";
import { DeleteIcon, EditIcon } from "@/components/icons/Icons";
import SearchComponent from "./components/SearchComponent";

function CustomRow(props) {
  return (
    <>
      <Tooltip title="Click 2 lần để xem chi tiết">
        <tr {...props} style={{ cursor: "pointer" }}>
          {props.children}
        </tr>
      </Tooltip>
    </>
  );
}
interface Content {
  id: number;
  title: string;
  state: string;
  created: string;
}

const initialValues = {
  created: moment().subtract(1, "days").format(dateFormat), // Lấy ngày cách đây 7 ngày, định dạng theo dateFormat
  pageNo: 1,
  pageSize: 10,
};
const Page: React.FC = () => {
  const [data, setData] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const [onReload, setOnReload] = useState(false);
  const [fixedParams, setFixedParams] = useState(initialValues);
  const [onResetFilter, setOnResetFilter] = useState(false);
  // Hàm fetch dữ liệu bằng fetch API

// Hàm lấy chi tiết bài viết
const fetchDetail = async (id: number) => {
  try {
    const res = await fetch(`http://localhost:3000/contents/${id}`);
    if (!res.ok) throw new Error("Không tìm thấy bài viết");
    const detail = await res.json();
    // Xử lý hiển thị chi tiết, ví dụ: mở modal hoặc chuyển trang
    alert(`Tiêu đề: ${detail.title}\nTrạng thái: ${detail.state}`);
  } catch (error) {
    alert("Có lỗi khi lấy chi tiết bài viết!");
  }
};

// Hàm xóa bài viết
const deleteContent = async (id: number) => {
  if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
  try {
    const res = await fetch(`http://localhost:3000/contents/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Xóa thất bại");
    alert("Đã xóa thành công!");
    fetchData(); // Refresh lại danh sách sau khi xóa
  } catch (error) {
    alert("Có lỗi khi xóa bài viết!");
  }
};

  const fetchData = async (pageNumber = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/contents?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      const result = await res.json();
      setData(result);
      // setTotal(result.total);
    } catch (error) {
      alert("Có lỗi khi lấy dữ liệu!");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (onReload) {
      fetchData();
    }
  }, [onReload]);

  const columns: ColumnsType<Content> = [
    {
      title: "#",
      dataIndex: "id",
    },
    {
      title: "Trạng thái",
      dataIndex: "state",
      render: (text: string) => {
        console.log(text);
        return (
          <Tag color={getTagColor(statusXB, text)}>
            {getConstantLabel(statusXB, text)}
          </Tag>
        );
        // return <span className="font-semibold">{getConstantLabel(statusXB, text)}</span>;
      },
    },
    {
      title: "Ngày xuất bản",
      dataIndex: "created",
      render: (text) => (
        <span className="font-semibold">
          {moment(text).format("DD/MM/YYYY HH:mm")}
        </span>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",

      render: (text) => <span className="text-blue-600">{text}</span>,
    },
    {
      title: "Thao tác",

      render: (_, record) => (
        <div className="flex gap-5 cursor-pointer">
      <Tooltip title="Xem">
        <FileSearchOutlined
          style={{ fontSize: 18 }}
          onClick={() => fetchDetail(record.id)}
        />
      </Tooltip>
      <EditIcon />
      <Tooltip title="Xóa">
        <DeleteIcon
         onClick={() => deleteContent(record.id)} />
      </Tooltip>
    </div>
      ),
    },
  ];

  return (
    <div className="mx-4  w-full">
      <SearchComponent
        setOnReload={setOnReload}
        form={form}
        setFixedParams={setFixedParams}
        productTypeOptions={statusXB}
        // showType={false}
        setOnResetFilter={setOnResetFilter}
      />
      <div className="mt-5 bg-white rounded">
        <div className="flex justify-between pt-4 pl-4">
          <div className="flex gap-2 text-muted">
            <div>
              Tổng bài viết:{" "}
              <span className="text-success">
                {/* {formatMoney(summary?.totalBaseTransaction)} */}
              </span>
            </div>
            <div>
              Tổng bài viết chưa duyệt:{" "}
              <span className="text-body fw-bold">
                {/* {formatMoney(summary?.totalBaseAmt, "đ")} */}
              </span>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          components={{
            body: {
              row: data?.length !== 0 && CustomRow,
            },
          }}
          pagination={{
            total,
            pageSize: 5,
            onChange: (page) => fetchData(page, 5),
          }}
          className="shadow-lg p-4"
        />
        <Modal >
          
        </Modal>
      </div>
    </div>
  );
};

export default Page;
