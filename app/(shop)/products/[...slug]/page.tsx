import PostNews from "@/components/share/PostNews";
import TitlePage from "@/components/share/TitlePage";
import { Post } from "@/types/contentItem";
import { fetchContentAlias, fetchContentId } from "@/modules/admin/contentApi";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

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
    const [category = '', rawId = ''] = params?.slug || [];

    // Loại bỏ .html nếu có
    const cleanSlug = category.replace(/\.html$/, '');
  
    // Tìm số ở cuối slug
    const match = cleanSlug.match(/-(\d+)$/); // Ví dụ: ao-thun-123
  
    const id = match ? Number(match[1]) : null; // nếu có thì dùng số, không thì null
    const alias = match ? null : cleanSlug;     // nếu không có số thì dùng alias
    let res;
    if (id !== null) {
      res = await fetchContentId(id);
    } else {
      res = await fetchContentAlias(alias as string);
    }
    // Gọi API lấy chi tiết nội dung
     res = await fetchContentAlias(category);
    const post: Post = res?.Data;
    // Nếu không có dữ liệu
    if (!post) {
      return {
        title: "Sản phẩm không tồn tại",
        description: "Không tìm thấy thông tin sản phẩm",
      };
    }

    return {
      title: post?.title || `Sản phẩm ${id}`,
      description: post?.metadesc || `Chi tiết sản phẩm mã ${id}`,
      keywords: post?.metakey || '',
      openGraph: {
        title: post.title,
        description: post.metadesc || '',
        images: post.urls ? [post.urls] : undefined,
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
  const [category = '', rawId = ''] = params?.slug || [];

  // Loại bỏ .html nếu có
  const cleanSlug = category.replace(/\.html$/, '');

  // Tìm số ở cuối slug
  const match = cleanSlug.match(/-(\d+)$/); // Ví dụ: ao-thun-123

  const id = match ? Number(match[1]) : null; // nếu có thì dùng số, không thì null
  const alias = match ? null : cleanSlug;     // nếu không có số thì dùng alias

  const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ');

  let post: Post;
  try {
    let res;
    if (id !== null) {
      res = await fetchContentId(id);
    } else {
      res = await fetchContentAlias(alias as string);
    }

    post = res.Data;
    if (!post) {
      redirect('/not-found');
    }
  } catch (error) {
    redirect('/not-found')
  }

  return (
    <main className="m-auto grid place-items-center" key={post?.id}>
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
                    // .replace(/<img/g, '<img loading="lazy" alt="' + decodedCategory + '"')
                    // .replace(/<a/g, '<a rel="nofollow"')
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