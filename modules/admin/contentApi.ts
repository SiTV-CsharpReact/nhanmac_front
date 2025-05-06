import { Post } from "@/types/contentItem";
import { notification } from "antd";

interface FetchContentParams {
  page?: number;
  pageSize?: number;
  endTime?: string;
  startTime?:string;
  state?: number;
  keySearch?: string;
  keyword?:string
}

// Lấy danh sách menu

export async function fetchContent(params: FetchContentParams = {}): Promise<Post[]> {
  try {
    console.log('fetchContent',params)
    // Build query string từ params
    const query = new URLSearchParams();

    if (params.page !== undefined) query.append('page', params.page.toString());
    if (params.pageSize !== undefined) query.append('pageSize', params.pageSize.toString());
    if (params.startTime) query.append('startTime', params.startTime);
    if (params.endTime) query.append('endTime', params.endTime);
    if (params.state) query.append('state', params.state.toString());
    if (params.keyword) query.append('keyword', params.keyword);
    console.log(query)
    // if (params.keySearch) query.append('keySearch', params.keySearch);
    // if (params.keySearch) query.append('keySearch', params.keySearch);

    const url = `http://localhost:3600/api/contents?${query.toString()}`;

    const res = await fetch(url);

    if (!res.ok) throw new Error("Failed to fetch contents");

    // API trả về { data: Post[], pagination: {...} } theo backend bạn đã sửa
    const json = await res.json();

    // Trả về mảng dữ liệu bài viết
    return json.data;

  } catch (error: any) {
    if (typeof window !== "undefined") {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể lấy danh sách nội dung",
      });
    }
    throw error;
  }
}

export async function fetchContentId(id: number): Promise<Post> {
  try {
    const res = await fetch(`http://localhost:3600/api/contents/${id}`);
    if (!res.ok) throw new Error("Failed to fetch content");
    return await res.json();
  } catch (error: any) {
    // Hiển thị thông báo lỗi (chỉ hoạt động ở client-side)
    if (typeof window !== "undefined") {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể lấy nội dung",
      });
    }
    throw error;
  }
}
export async function fetchContentAlias(alias: string): Promise<Post> {
  try {
    const res = await fetch(`http://localhost:3600/api/contents/alias/${alias}`);
    if (!res.ok) throw new Error("Failed to fetch content");
    return await res.json();
  } catch (error: any) {
    // Hiển thị thông báo lỗi (chỉ hoạt động ở client-side)
    if (typeof window !== "undefined") {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể lấy nội dung",
      });
    }
    throw error;
  }
}