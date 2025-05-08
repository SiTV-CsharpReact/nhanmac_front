export interface Post {
    id: number;
    title: string;
    alias: string;
    title_alias: string;
    introtext: string;
    fulltext: string;
    state: number;
    created: string;
    created_by: number;
    sectionid: number;
    mask: number;
    metakey: string;
    catid: number;
    // ... các trường khác nếu có
  }
export interface ListPost{
  list:Post[];
  total:number
}