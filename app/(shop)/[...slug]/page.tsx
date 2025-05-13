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
    slug: string[];
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params, searchParams }: Props) {
  const p = await params;
  const sp = await searchParams;

  const [category = "", rawId = ""] = p?.slug || [];
  const { id, alias } = parseSlug(category);

  const page = parseInt((sp?.page as string) || "1");
  const pageSize = parseInt((sp?.pageSize as string) || "9");

  let sttPageId: boolean = false;
  let postList: Post[] = [];
  let total = 0;
  let totalPages = 0;

  try {
    if (id !== null) {
  const { data, redirectUrl } = await fetchContentBySlugId(slug, id);

        if (redirectUrl) {
          redirect(redirectUrl);
          return; // Ngăn render tiếp
        }
      sttPageId = true;
      // res.Data là 1 Post object
      postList = [data.Data]; // gói vào mảng để dễ xử lý nếu cần
    } else {
      const res = await fetchCateAlias(alias as string, page, pageSize);
      sttPageId = false;
      postList = res.Data?.list || [];
      total = res.Data?.total || 0;
      totalPages = res.Data?.totalPages || 0;
    }

    if (!postList || postList.length === 0) {
      return <p className="text-center mt-10 text-gray-500">Không có bài viết nào.</p>;
    }
  } catch (error) {
    redirect("/not-found");
  }

  return (
    // <main className="m-auto grid place-items-center">
    //   <div className="container mb-15">
    //     {/* Tiêu đề */}
    //     <TitlePage />

    //     <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-6">
    //       {/* Nội dung chính */}
    //       <article className="w-full md:w-2/3">
    //         {sttPageId ? (
    //           postList[0]?.introtext ? (
    //             <section
    //               className="prose max-w-none"
    //               dangerouslySetInnerHTML={{ __html: postList[0].introtext }}
    //             />
    //           ) : (
    //             <p className="text-gray-500">Đang cập nhật nội dung...</p>
    //           )
    //         ) : (
    //           <>
    //            <CatePage postList={postList} />
    //             <Pagination page={page} totalPages={totalPages} alias={alias as string} />
    //           </>
    //         )}
    //       </article>

    //       {/* Sidebar */}
    //       <aside className="w-full md:w-1/3 flex flex-col gap-6">
    //         <PostNews />
    //       </aside>
    //     </div>
    //   </div>
    // </main>
    <main className="mx-auto px-4"> {/* Thêm padding ngang cho mobile */}
  <div className="max-w-full md:max-w-7xl mx-auto mb-6"> {/* Giới hạn max-width trên md trở lên */}
    {/* Tiêu đề */}
    <TitlePage />

    <div className="flex flex-col md:flex-row gap-6">
      {/* Nội dung chính */}
      <article className="w-full md:w-2/3">
        {sttPageId ? (
          postList[0]?.introtext ? (
            <section
              className="prose max-w-full" // max-w-full để không giới hạn chiều rộng trên mobile
              dangerouslySetInnerHTML={{ __html: postList[0].introtext.replace(
                /href="index\.php\/[^\/]+\/[^\/]+\/(\d+)-([^"]+)\.html"/g,
                (match, id, slug) => {
                  // id là số (ví dụ 519)
                  // slug là phần còn lại sau id và dấu '-'
                  // Đổi thành: slug + '-' + id + '.html'
                  return `href="${slug}-${id}.html"`;
                }
              ) }}
            />
          ) : (
            <p className="text-gray-500">Đang cập nhật nội dung...</p>
          )
        ) : (
          <>
            <CatePage postList={postList} />
            <Pagination page={page} totalPages={totalPages} alias={alias as string} />
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
