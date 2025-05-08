import { ApiResponse } from "@/types/apiResponse";
import { Category } from "@/types/categoryItem";
import { env } from "@/config/env";
// import { Post } from "@/types/contentItem";

// categoryApi.ts
// categoryApi.ts
const API_URL = `${env.apiUrl}/categories`;

export const categoryApi = {
  async getAll(): Promise<ApiResponse<Category[]>> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  },

  async create(category: Omit<Category, "id">): Promise<ApiResponse<Category>> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error("Failed to create category");
    return await res.json();
  },

  async update(id: number, category: Partial<Category>): Promise<ApiResponse<Category>> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error("Failed to update category");
    return await res.json();
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete category");
    return await res.json();
  },
};
