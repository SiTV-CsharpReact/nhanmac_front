import { Post } from "@/types/contentItem";
import { notification } from "antd";

// Lấy danh sách menu
export async function fetchContent(): Promise<Post[]> {
  try {
    const res = await fetch("http://localhost:3000/api/contents");
    if (!res.ok) throw new Error("Failed to fetch menu");
    return await res.json();
  } catch (error: any) {
    // Hiển thị thông báo lỗi (chỉ hoạt động ở client-side)
    if (typeof window !== "undefined") {
      notification.error({
        message: "Lỗi",
        description: error.message || "Không thể lấy danh sách menu",
      });
    }
    throw error; // Vẫn throw error để phía component có thể bắt
  }
}

export async function fetchContentId(id: number): Promise<Post> {
  try {
    const res = await fetch(`http://localhost:3000/api/contents/${id}`);
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
    const res = await fetch(`http://localhost:3000/api/contents/alias/${alias}`);
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