import type { MenuItem } from "@/types/MenuItem";

// Lấy danh sách menu
export async function fetchMenus(): Promise<MenuItem[]> {
  const res = await fetch("http://localhost:3000/api/menu");
  if (!res.ok) throw new Error("Lỗi lấy danh sách menu");
  return await res.json();
}

// Thêm menu mới
export async function addMenu(data: Omit<MenuItem, "id" | "children" | "key">) {
  const res = await fetch("http://localhost:3000/api/menu/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Lỗi thêm menu");
  }
  return await res.json();
}

// Sửa menu
export async function editMenu(id: number, data: Omit<MenuItem, "id" | "children" | "key">) {
  const res = await fetch(`http://localhost:3000/api/menu/edit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Lỗi sửa menu");
  }
  return await res.json();
}

// Xóa menu
export async function deleteMenu(id: number) {
  const res = await fetch(`http://localhost:3000/api/menu/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Lỗi xóa menu");
  }
  return await res.json();
}
