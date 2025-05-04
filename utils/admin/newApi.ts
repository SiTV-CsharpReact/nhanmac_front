import { Post } from "@/types/contentItem";

// Lấy danh sách menu
export async function fetchNewTopPosts(): Promise<Post[]> {
    const res = await fetch("http://localhost:3000/api/news/top-posts");
    if (!res.ok) throw new Error("Lỗi lấy danh sách menu");
    return await res.json();
  }
  