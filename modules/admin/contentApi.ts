import { Post } from "@/types/contentItem";
import { notification } from "antd";

interface FetchContentParams {
  pageNumber?: number;
  pageSize?: number;
  created?: string;
  state?: string;
  keySearch?: string;
}

// Lấy danh sách menu

export async function fetchContent(params: FetchContentParams = {}): Promise<Post[]> {
  try {
    // Build query string từ params
    const query = new URLSearchParams();

    if (params.pageNumber !== undefined) query.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize !== undefined) query.append('pageSize', params.pageSize.toString());
    if (params.created) query.append('created', params.created);
    if (params.state) query.append('state', params.state);
    if (params.keySearch) query.append('keySearch', params.keySearch);

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