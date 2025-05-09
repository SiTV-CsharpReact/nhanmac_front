import { env } from "@/config/env";
import { ApiResponse } from "@/types/apiResponse";
import type { MenuItem } from "@/types/MenuItem";

// Lấy danh sách menu
export async function fetchMenus(): Promise<ApiResponse<MenuItem[]>> {
  const res = await fetch(`${env.apiUrl}/menu`);
  if (!res.ok) throw new Error("Lỗi lấy danh sách menu");
  return await res.json();
}