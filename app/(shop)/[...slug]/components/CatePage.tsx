import Link from "next/link";
import { Post } from "@/types/contentItem";

type CatePageProps = {
    postList: Post[];
};

export default function CatePage({ postList }: CatePageProps) {
    if (!postList || postList.length === 0) {
        return <p className="text-center text-gray-500">Không có bài viết nào.</p>;
    }

    return (
        <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {postList.map((item) => (
                    <Link href={`/products/${item.alias}-${item.id}`} key={`${item.alias}-${item.id}`}>
                        <div className="bg-white shadow rounded p-4 hover:shadow-md transition cursor-pointer h-full flex flex-col">
                            <img
                                src={item.urls || "/images/default.jpg"}
                                alt={item.content_title}
                                className="w-full h-48 object-cover mb-3 rounded"
                            />
                            <h3 className="text-sm font-normal leading-5 line-clamp-2 text-[#2F80ED] mt-auto">
                                {item.content_title}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
}
