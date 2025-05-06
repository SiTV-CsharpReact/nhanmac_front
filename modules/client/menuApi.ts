import type { MenuItem } from "@/types/MenuItem";

// Lấy danh sách menu
export async function fetchMenus(): Promise<MenuItem[]> {
  const res = await fetch("http://localhost:3600/api/menu");
  if (!res.ok) throw new Error("Lỗi lấy danh sách menu");
  return await res.json();
}