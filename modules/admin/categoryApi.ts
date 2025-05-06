import { Category } from "@/types/categoryItem";

// categoryApi.ts
// categoryApi.ts
const API_URL = "http://localhost:3600/api/categories";

export const categoryApi = {
  async getAll(): Promise<Category[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch categories");
    const json = await res.json();
    if (json.status !== "success") throw new Error(json.message || "API error");
    return json.data; // <-- Lấy từ trường data
  },

  async create(category: Omit<Category, "id">): Promise<Category> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error("Failed to create category");
    const json = await res.json();
    if (json.status !== "success") throw new Error(json.message || "API error");
    return json.data;
  },

  async update(id: number, category: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error("Failed to update category");
    const json = await res.json();
    if (json.status !== "success") throw new Error(json.message || "API error");
    return json.data;
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete category");
    const json = await res.json();
    if (json.status !== "success") throw new Error(json.message || "API error");
    // Không cần return gì nếu không có data
  },
};
