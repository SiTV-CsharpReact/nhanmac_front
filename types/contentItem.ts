export interface Post {
  id: number;
  title: string;
  alias: string;
  title_alias: string;
  introtext: string;
  fulltext: string;
  state: number;
  sectionid: number;
  mask: number;
  catid: number;
  created: string;
  created_by: number;
  created_by_alias: string;
  modified: string;
  modified_by: number;
  checked_out: number;
  checked_out_time: string;
  publish_up: string;
  publish_down: string;
  images?: string | null;      // Có thể null
  urls?: string | null;        // Có thể null
  attribs?: string | null;     // Có thể null
  version: number;
  parentid: number;
  ordering: number;
  metakey?: string | null;     // Có thể null
  metadesc?: string | null;    // Có thể null
  access: number;
  hits: number;
  metadata?: string | null;    // Có thể null
  image_desc?: string | null;  // Có thể null
    // ... các trường khác nếu có
  }
export interface ListPost{
  list:Post[];
  total:number
}