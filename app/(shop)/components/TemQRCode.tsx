import { fetchCateAlias } from '@/modules/client/menuApi';
import { Post } from '@/types/contentItem';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
// Giả sử API trả về mảng object dạng { id, title, image, imageAlt }

export default async function TemQRCode() {
    let postList: Post[] = [];
    // Fetch dữ liệu từ API (thay URL thành API thật của bạn)
    const res = await fetchCateAlias('nhan-kim-loai' as string, 1, 5);
    postList = res.Data?.list || [];
    console.log(postList)    //   const categories: Category[] = await res.json();

    return (
        <div className="p-1 py-2 md:p-6 space-y-12 grid place-items-center">
            <div className="container">

                <div className="text-center">
                    <h2 className="text-2xl md:text-[32px] font-semibold text-center inline-block ">
                        TEM QR CODE
                    </h2>
                    <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[255px] mb-5 sm:w-[255px]"></div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {postList.map((label, i) => (
                            <Link href={`${label.alias + label.id}.html`} key={`${label.id}-${i}`}
                            // onClick={()=>Cookies.set('activeParent', 'Ti')}

                            >
                                <div
                                    key={`${label.id}-${i}`}
                                    className="bg-white shadow-custom p-0 flex flex-col items-center"
                                >
                                    <div className="relative w-full aspect-[245/173] bg-gray-100 mb-2 overflow-hidden rounded-md">
                                        {label.urls ? (
                                            <Image
                                                src={`https://nhanmac.vn/${label.urls}`}
                                                alt={label.image_desc || "Ảnh sản phẩm"}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                sizes="(max-width: 768px) 100vw, 245px"
                                                className="rounded-md"
                                                priority={i < 2}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
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
                </div>

            </div>
        </div>
    );
}
