import { Post } from "@/types/contentItem";
import { fetchNewTopPosts } from "@/modules/admin/newApi";
import Image from "next/image";
import { fetchSlides } from "@/modules/client/hompageApi";
import Link from "next/link";

// Component con cho Social Icon (tách riêng để tái sử dụng)
const SocialIcon = ({
    href,
    icon,
    alt,
    bgColor = ""
}: {
    href: string;
    icon: string;
    alt: string;
    bgColor?: string;
}) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={`flex items-center justify-center w-[34px] h-[34px] rounded-full ${bgColor}`}
    >
        <Image
            src={icon}
            alt={alt}
            width={24}
            height={24}
            aria-label={alt}
        />
    </a>
);

// Component SupportSection (tách riêng)
const SupportSection = () => (
    <div className="bg-blue-50 p-4 rounded" itemScope itemType="https://schema.org/ContactPage">
        <h2 className="text-2xl font-semibold mb-2 text-center">
            Hỗ trợ trực tuyến
        </h2>
        <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[160px] mb-5"></div>

        <div className="text-[#2F80ED] text-center text-2xl font-semibold" itemProp="name">
            Ms. Lan Anh
        </div>

        <div className="grid grid-cols-12 gap-4 mt-4">
            <div className="flex items-center gap-4 col-span-7 md:col-span-7">
                <Image
                    src="/icons/phone-call-red.svg"
                    alt="Hotline"
                    width={62}
                    height={62}
                    aria-hidden="true"
                />
                <div>
                    <p className="font-bold">Hotline 24/7</p>
                    <a
                        href="tel:0912424368"
                        className="text-[#EB5757] text-xl font-bold"
                        itemProp="telephone"
                    >
                        0912.424.368
                    </a>
                </div>
            </div>

            <div className="flex items-center gap-4 col-span-5 md:col-span-5">
                <div>
                    <p className="font-medium text-[#828282] text-base">
                        Hỗ trợ khách hàng
                    </p>
                    <div className="flex gap-2 mt-1">
                        <SocialIcon
                            href="https://zalo.me/..."
                            icon="/icons/Icon_of_Zalo.svg"
                            alt="Zalo"
                        />
                        <SocialIcon
                            href="https://facebook.com/..."
                            icon="/icons/brand-facebook-no-border.svg"
                            alt="Facebook Messenger"
                            bgColor="bg-[#2F80ED]"
                        />
                        <SocialIcon
                            href="mailto:contact@example.com"
                            icon="/icons/brand-gmail-no-border.svg"
                            alt="Gmail liên hệ"
                            bgColor="bg-white border-2 border-[#EB5757]"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Component chính với SSR
export default async function PostNews() {
    // Fetch data trực tiếp trên server
    let posts: Post[] = [];
    try {
        // posts = await fetchNewTopPosts();
        const res = await fetchSlides();
        posts = res.Data;
    } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
        // Có thể redirect hoặc trả về UI fallback tại đây
    }

    return (
        <>
            <section aria-label="Danh sách bài viết mới" className="bg-blue-50 p-4 rounded">
                <h2 className="text-2xl font-semibold mb-2 text-center">
                    Bài viết mới
                </h2>
                <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[160px] mb-5"></div>

                {posts.length === 0 ? (
                    <p className="text-center text-gray-500">Chưa có bài viết mới</p>
                ) : (
                    <ul>
                        {posts.map((post) => (
                            console.log(post?.urls),
                            <Link href={`${post.alias +'-'+ post.id}.html`}  title={post.title} key={post.id} className="group">

                                <li key={post.id} className="flex bg-white gap-2 mb-3 hover:bg-gray-100 rounded p-2">
                                    <Image
                                        src={post.urls?.startsWith("http")
                                        ? post.urls
                                        : `https://nhanmac.vn/${post.urls}`}
                                        width={80}
                                        height={60}
                                        alt={`Ảnh minh họa cho bài viết ${post.title}`}
                                        className="object-cover rounded"
                                        priority={false}
                                        loading="lazy"
                                    />

                                    <span

                                        className="m-4 text-base line-clamp-2 group-hover:text-[#2F80ED]"
                                        aria-label={`Đọc bài viết: ${post.title}`}
                                    >
                                        {post.title}
                                    </span>
                                </li>
                            </Link>
                        ))}
                    </ul>
                )}
            </section>

            <SupportSection />
        </>


    );
}