export interface Category {
    id: number;
    title: string;
    name: string;
    alias: string;
    parent_id: number | null;
    image?: string;
    section?: string;
    image_position?: string;
    description?: string;
    published: number;
    checked_out?: number;
    checked_out_time?: string;
    editor?: string;
    ordering?: number;
    access?: number;
    count?: number;
    params?: string;
  }