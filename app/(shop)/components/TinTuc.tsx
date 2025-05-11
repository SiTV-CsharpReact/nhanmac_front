import { fetchCateAlias } from '@/modules/client/menuApi';
import { Post } from '@/types/contentItem';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
// Giả sử API trả về mảng object dạng { id, title, image, imageAlt }

export default async function TinTuc() {
    let postList: Post[] = [];
    // Fetch dữ liệu từ API (thay URL thành API thật của bạn)
    const res = await fetchCateAlias('nhan-kim-loai' as string, 1, 5);
    postList = res.Data?.list || [];
    console.log(postList)    //   const categories: Category[] = await res.json();

    return (
        <div className="bg-[#EAF2FE] p-2 md:p-5">
            <h2 className="text-2xl md:text-[32px] font-semibold text-center ">
                TIN TỨC
            </h2>
            <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[255px] mb-5 sm:w-[255px]"></div>
            <div className="grid grid-cols-2 gap-4">
                {postList.slice(0, 2).map((label, i) => (
                    <Link href={`${label.alias + label.id}.html`} key={`${label.id}-${i}`} 
                    // onClick={()=>Cookies.set('activeParent', 'Ti')}
                    >
                        <div

                            className="bg-white shadow-custom rounded p-2 flex flex-col items-center"
                        >
                            <div className="w-full mb-2 flex items-center justify-center">
                                {label.urls ? (
                                    <Image
                                        src={label.urls}
                                        alt={label.image_desc || "Ảnh sản phẩm"}
                                        height={173}
                                        width={245}
                                    />
                                ) : (
                                    // Có thể hiển thị ảnh mặc định hoặc placeholder
                                    <div className="w-[245px] h-[173px] bg-gray-200 flex items-center justify-center text-gray-400">
                                        Ảnh không có sẵn
                                    </div>
                                )}
                            </div>
                            <p className="text-[15px] font-normal text-[#2F80ED] text-left p-2.5">
                                    {label.content_title}
                                </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div >
    );
}
