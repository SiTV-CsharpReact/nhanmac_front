import PostNews from "@/components/share/PostNews";
import TitlePage from "@/components/share/TitlePage";
import { Post } from "@/types/contentItem";
import { fetchContentAlias, fetchContentId } from "@/modules/admin/contentApi";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { 
    slug: string[];
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const [category = '', id = ''] = params.slug || [];
    const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ');
    
    return {
      title: `${decodedCategory} | Sản phẩm ${id}`,
      description: `Chi tiết sản phẩm ${decodedCategory} - Mã ${id}`,
      openGraph: {
        title: `${decodedCategory} | Thông tin sản phẩm`,
        description: `Xem chi tiết sản phẩm ${decodedCategory}`,
      },
    };
  } catch (error) {
    console.error("Lỗi khi tạo metadata:", error);
    return {
      title: "Sản phẩm | Công ty chúng tôi",
      description: "Thông tin chi tiết về sản phẩm",
    };
  }
}

export default async function Page({ params }: Props) {
  // Xử lý slug an toàn
  const [category = '', id = ''] = params.slug || [];
  const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ');

  let post: Post | undefined;
  try {
    // Nên thay bằng API lấy theo slug hoặc id thực tế
    post = await fetchContentAlias(category);
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    return (
      <div className="container py-10 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Lỗi khi tải dữ liệu sản phẩm</h2>
        <a href="/products" className="text-blue-600 hover:underline">
          Quay lại trang sản phẩm
        </a>
      </div>
    );
  }

  return (
    <main className="m-auto grid place-items-center">
      <div className="container mb-15">
        {/* Tiêu đề */}
        <TitlePage text={post?.title} />

        <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-6">
          {/* Nội dung chính */}
          <article className="w-full md:w-2/3">
            <h1 className="sr-only">{decodedCategory}</h1>
            
            {post?.introtext ? (
              <section 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: post.introtext
                    .replace(/<img/g, '<img loading="lazy" alt="' + decodedCategory + '"')
                    .replace(/<a/g, '<a rel="nofollow"')
                }} 
              />
            ) : (
              <p className="text-gray-500">Đang cập nhật nội dung...</p>
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