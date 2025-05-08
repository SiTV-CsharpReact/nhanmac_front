"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Tooltip, Form, Modal, notification, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { dateFormat, statusXB } from "@/config/config";
import { formatMoney, getConstantLabel, getTagColor } from "@/utils/util";
// import moment from "moment";
import dayjs from'dayjs';
import { FileSearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { DeleteIcon, EditIcon } from "@/components/icons/Icons";
import SearchComponent from "./components/SearchComponent";
import { deleteContent, fetchContent, fetchContentId } from "@/modules/admin/contentApi";
import { Post } from "@/types/contentItem";
import CustomModal from "@/components/share/CustomModal";
import ContentArticle from "./components/ContentArticle";
import ViewArticle from "./components/ViewArticle";
import { categoryApi } from "@/modules/admin/categoryApi";
import TitlePage from "@/components/share/TitlePage";
import TitlePageAdmin from "@/components/share/TitlePageAdmin";
import { ApiResponse } from "@/types/apiResponse";
import { useRouter } from "next/navigation";
import type { TablePaginationConfig } from "antd/es/table";
import type { GetRowKey } from "antd/es/table/interface";
import type { OnRow } from "antd/es/table/interface";

interface CustomRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const CustomRow: React.FC<CustomRowProps> = ({ children, onClick, className }) => {
  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer hover:bg-gray-50 transition-colors ${className || ''}`}
    >
      {children}
    </tr>
  );
};

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
}

interface TableItem extends Post {
  key: number;
}

const initialParams = {
  created: [dayjs().subtract(1, "days"), dayjs()], // ví dụ 'YYYY-MM-DD'
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
  const [data, setData] = useState<TableItem[]>([]);
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
  const [resetForm, setResetForm] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [searchText, setSearchText] = useState("");
  const [selectedState, setSelectedState] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  // Reset form khi mở modal
  useEffect(() => {
    if (isSttModal?.openModal) {
      setResetForm(true);
      setTimeout(() => setResetForm(false), 100);
    }
  }, [isSttModal?.openModal]);

  // Hàm fetch dữ liệu bằng fetch API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchContent({
        page: tableParams.pagination?.current ? tableParams.pagination.current - 1 : 0,
        pageSize: tableParams.pagination?.pageSize,
        keySearch: searchText,
        state: selectedState,
        startTime: startDate,
        endTime: endDate,
      });

      if (response.Code === 200 && response.Data) {
        const rawData = Array.isArray(response.Data) ? response.Data : [];
        const formattedData = rawData.map((item) => ({
          ...item,
          key: item.id,
        }));
        setData(formattedData);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: response.Total || 0,
          },
        });
      } else {
        setData([]);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: 0,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: 0,
        },
      });
    }
    setLoading(false);
  };

  // Hàm lấy chi tiết bài viết
  const fetchDetail = async (id: number) => {
    try {
      const result = await fetchContentId(id);
      if (result.Code === 200) {
        setDataDetail(result.Data);
      }
    } catch (error) {
      // Error đã được xử lý trong API
    }
  };
  
  // Hàm xóa bài viết
  const handleDeleteContent = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    try {
      const result = await deleteContent(id);
      if (result.Code === 200) {
        notification.success({
          message: "Thành công",
          description: "Đã xóa bài viết thành công!",
        });
        fetchData(); // Refresh lại danh sách sau khi xóa
      }
    } catch (error) {
      // Error đã được xử lý trong API
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams), searchText, selectedState, startDate, endDate]);

  useEffect(() => {
    // Chỉ gọi API khi typeModal là 2 (chỉnh sửa) và có idContent
    if (isSttModal?.openModal && isSttModal?.typeModal === 2 && isSttModal?.idContent) {
      fetchDetail(isSttModal.idContent);
    }
  }, [isSttModal?.openModal, isSttModal?.idContent, isSttModal?.typeModal]);

  const columns: ColumnsType<TableItem> = [
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
      dataIndex: "created_at",
      render: (text) => (
        <span className="font-semibold">
          {dayjs(text).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Alias",
      dataIndex: "alias",
      key: "alias",
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
          <EditIcon onClick={() => 
            setIsSttModal({
              idContent: record?.id,
              typeModal: 2,
              openModal: true,
            })
          } />
          <Tooltip title="Xóa">
            <DeleteIcon onClick={() => handleDeleteContent(record.id)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setTableParams({
      ...tableParams,
      pagination: newPagination,
    });
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  const handleStateChange = (value: number) => {
    setSelectedState(value);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  const handleDateChange = (dates: any) => {
    if (dates) {
      setStartDate(dates[0]?.startOf("day")?.format(dateFormat));
      setEndDate(dates[1]?.endOf("day")?.format(dateFormat));
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  const handleEdit = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedId(null);
    fetchData();
  };

  return (
    <div className="mx-4  w-full">
      <div className="bg-white">
      <TitlePageAdmin text={'Quản lý bài viết'}/>
      <SearchComponent
        setOnReload={() => setOnReload(prev => !prev)}
        form={form}
        setFixedParams={setFixedParams}
        productTypeOptions={statusXB}
        // showType={false}
        setOnResetFilter={setOnResetFilter}
      />
      </div>
      
      <div className="mt-5 bg-white rounded">
        <div className="flex justify-between pt-4 px-4">
          <div className="flex gap-2 text-muted">
            <div>
              Tổng bài viết:{" "}
              <span className="text-success">{formatMoney(totalPage, "")}</span>
            </div>
            <div>Tổng bài viết chưa duyệt: </div>
          </div>
          <div>
            <Button icon={<PlusCircleOutlined />} onClick={()=>setIsSttModal({ typeModal: 1, openModal: true })}>
              Tạo mới 
            </Button>
          
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
          rowKey="id"
          onRow={(record: TableItem) => {
            const rowProps: React.HTMLAttributes<HTMLTableRowElement> = {
              onClick: () => handleEdit(record.id),
              style: { cursor: 'pointer' }
            };
            return rowProps;
          }}
          components={{
            body: {
              row: (props: any) => {
                const { children, ...restProps } = props;
                return (
                  <tr {...restProps} style={{ cursor: 'pointer' }}>
                    {children}
                  </tr>
                );
              }
            }
          }}
        />
        <CustomModal
          header={`${
            isSttModal?.typeModal == 0 ? `Chi tiết` : isSttModal?.typeModal == 1? `Thêm mới`:`Chỉnh sửa`
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
                  reset={resetForm}
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


