"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Tooltip, Form, Modal, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import { dateFormat, statusXB } from "@/config/config";
import { formatMoney, getConstantLabel, getTagColor } from "@/utils/util";
import moment from "moment";
import { FileSearchOutlined } from "@ant-design/icons";
import { DeleteIcon, EditIcon } from "@/components/icons/Icons";
import SearchComponent from "./components/SearchComponent";
import { fetchContent, fetchContentId } from "@/modules/admin/contentApi";
import { Post } from "@/types/contentItem";
import CustomModal from "@/components/share/CustomModal";
import ContentArticle from "./components/ContentArticle";
import ViewArticle from "./components/ViewArticle";

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

const initialParams = {
  created: moment().subtract(1, "days").format(dateFormat), // ví dụ 'YYYY-MM-DD'
  pageNumber: 1,
  pageSize: 10,
  state: undefined,
  keySearch: undefined,
};
interface StatusModal {
  idContent?: number | undefined;
  openModal: boolean;
  typeModal: number | undefined;
}

export const defaultPagin = {
  current: 1,
  pageSize: 10,
  total: 0,
}

const Page: React.FC = () => {
  const [data, setData] = useState<Post[]>([]);
  const [dataDetail, setDataDetail] = useState<Post>();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const [onReload, setOnReload] = useState(false);
  const [fixedParams, setFixedParams] = useState(initialParams);
  const [onResetFilter, setOnResetFilter] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [isSttModal, setIsSttModal] = useState<StatusModal>();
  const [pagination, setPagination] = useState(defaultPagin);
  // Hàm fetch dữ liệu bằng fetch API

  // Hàm lấy chi tiết bài viết
  const fetchDetail = async (id: number) => {
    try {
      const result = await fetchContentId(id);
      setDataDetail(result);
      console.log(dataDetail);
    } catch (error) {
      alert("Có lỗi khi lấy chi tiết bài viết!");
    }
  };

  // Hàm xóa bài viết
  const deleteContent = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    try {
      const res = await fetch(`http://localhost:3600/contents/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      alert("Đã xóa thành công!");
      fetchData(); // Refresh lại danh sách sau khi xóa
    } catch (error) {
      alert("Có lỗi khi xóa bài viết!");
    }
  };

  const fetchData = async () => {
    const { created, ...remain } = form.getFieldsValue();
    const params = {
      startTime: moment(created?.[0])
        ?.startOf("day")
        ?.format(dateFormat),
      endTime: moment(created?.[1])
        ?.endOf("day")
        ?.format(dateFormat),
      page: pagination?.current - 1,
      pageSize: pagination?.pageSize,
      ...remain,
    };
    console.log(params)
    setLoading(true);
    try {
      const result = await fetchContent(params);
      setData(result.data);
      setTotalPage(result.pagination.total);
      setTotal(result.pagination.total);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi khi lấy dữ liệu!",
      });
    }
    setLoading(false);
  };
  

  useEffect(() => {
   
    fetchData();
  }, [onReload,pagination?.current, pagination?.pageSize]);

  useEffect(() => {
    if (isSttModal?.openModal && isSttModal?.idContent !== 0) {
      console.log(isSttModal?.openModal, isSttModal?.idContent);
      fetchDetail(isSttModal.idContent);
    }
  }, [isSttModal?.openModal, isSttModal?.idContent]);

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
          {moment(text).format("DD/MM/YYYY")}
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
      width: 90,
      fixed: "right",
      render: (_, record) => (
        <div className="flex gap-5 cursor-pointer">
          <Tooltip title="Xem">
            <FileSearchOutlined
              style={{ fontSize: 18 }}
              onClick={() =>
                setIsSttModal({
                  idContent: record?.id,
                  typeModal: 0,
                  openModal: true,
                })
              }
            />
          </Tooltip>
          <EditIcon />
          <Tooltip title="Xóa">
            <DeleteIcon onClick={() => deleteContent(record.id)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

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
              <span className="text-success">{formatMoney(totalPage, "")}</span>
            </div>
            <div>Tổng bài viết chưa duyệt: </div>
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
          // pagination={{
          //   total: totalPage,
          //   pageSize: fixedParams.pageSize,
          //   current: fixedParams.pageNumber,
          //   onChange: (page, pageSize) => {
          //     setFixedParams((prev) => ({ ...prev, pageNumber: page, pageSize }));
          //     setOnReload((prev) => !prev);
          //   },
          // }}
          pagination={{
            ...pagination,
            showTotal: (total, range) => {
              const rangeNumber = range[1] - range[0] + 1;
              return `Hiển thị ${rangeNumber} trên ${total} kết quả`;
            },
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          className="shadow-lg p-4"
        />
        <CustomModal
          header={`${
            isSttModal?.typeModal == 0 ? `Chi tiết` : `Chỉnh sửa`
          } bài viết`}
          onCancel={() => setIsSttModal({ typeModal: 0, openModal: false })} // Xử lý đóng modal
          open={isSttModal?.openModal}
          width={1200}
          children={
            <>
              {isSttModal?.typeModal == 0 ? (
                <ViewArticle data={dataDetail?.introtext} />
              ) : (
                <ContentArticle
                  typeModal={isSttModal?.typeModal}
                  data={dataDetail}
                />
              )}
            </>
          }
        ></CustomModal>
      </div>
    </div>
  );
};

export default Page;
