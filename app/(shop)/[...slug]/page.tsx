import PostNews from "@/components/share/PostNews";
import TitlePage from "@/components/share/TitlePage";
import { Post } from "@/types/contentItem";
import { redirect } from "next/navigation";
import { fetchCateAlias, fetchContentBySlugId } from "@/modules/client/menuApi";
// import { fetchContentBySlugId } from "@/modules/admin/contentApi";
import { parseSlug } from "@/utils/util";
import Pagination from "./components/Pagination";
import CatePage from "./components/CatePage";

type Props = {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ slug: string[] }>
  searchParams:Promise<{ searchParams?: { [key: string]: string | string[] | undefined };}>
}) {
  const { slug } = await params;
 const { sp } = await searchParams;
 const invalidFiles = ['favicon.ico', 'upload', 'sitemap.xml'];
 console.log(slug[0])
  // Nếu slug là favicon.ico thì không xử lý tiếp mà trả về null hoặc một thông báo
  if (slug.length === 1 && invalidFiles.includes(slug[0].toLowerCase())) {
    return null; // hoặc trả về 404, hoặc component thông báo không tìm thấy
  }

  const { id, alias } = parseSlug(slug[0]);
    if(
    invalidFiles.includes(alias)
  ){
       return null
  }
   const page = parseInt((sp?.page as string) || "1");
  const pageSize = parseInt((sp?.pageSize as string) || "9");

  let sttPageId: boolean = false;
  let postList: Post[] = [];
  let total = 0;
  let totalPages = 0;
  let textTitle;
  console.log({ id, alias })
    try {
    if (id !== null) {
      const { data } = await fetchContentBySlugId(alias, id);

      sttPageId = true;
      // res.Data là 1 Post object
      if (data?.Data?.correctUrl) {
        textTitle = data.Data?.article?.parent_cat_name;
        postList = [data.Data.article];
        redirect(data?.Data?.correctUrl)
      } else {
        textTitle = data.Data?.parent_cat_name;
        postList = [data.Data]; // gói vào mảng để dễ xử lý nếu cần
      }
    } else {
      const res = await fetchCateAlias(alias as string, page, pageSize);
      sttPageId = false;
      postList = res.Data?.list || [];
      total = res.Data?.total || 0;
      totalPages = res.Data?.totalPages || 0;
    }

    if (!postList || postList.length === 0) {
      return (
        <p className="text-center mt-10 text-gray-500">
          Không có bài viết nào.
        </p>
      );
    }
  } catch (error) {
    console.log(error);
    // redirect("/not-found");
  }
  return (
    <main className="mx-auto px-4">
      {" "}
      {/* Thêm padding ngang cho mobile */}
      <div className="max-w-full md:max-w-7xl mx-auto mb-6">
        {" "}
        {/* Giới hạn max-width trên md trở lên */}
        {/* Tiêu đề */}
        <TitlePage text={textTitle} />
        <div className="flex flex-col md:flex-row gap-6">
          {/* Nội dung chính */}
          <article className="w-full md:w-2/3">
            {sttPageId ? (
              postList[0]?.introtext ? (
                <section
                  className="prose max-w-full" // max-w-full để không giới hạn chiều rộng trên mobile
                  dangerouslySetInnerHTML={{
                    __html: postList[0].introtext.replace(
                      /href="index\.php\/[^\/]+\/[^\/]+\/(\d+)-([^"]+)\.html"/g,
                      (match, id, slug) => {
                        // id là số (ví dụ 519)
                        // slug là phần còn lại sau id và dấu '-'
                        // Đổi thành: slug + '-' + id + '.html'
                        return `href="${slug}-${id}.html"`;
                      }
                    ),
                  }}
                />
              ) : (
                <p className="text-gray-500">Đang cập nhật nội dung...</p>
              )
            ) : (
              <>
                <CatePage postList={postList} />
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  alias={alias as string}
                />
              </>
            )}
          </article>

          {/* Sidebar */}
          <aside className="w-full md:w-1/3 flex flex-col gap-6">
            <PostNews />
          </aside>
        </div>
      </div>
    </main>
  );
}