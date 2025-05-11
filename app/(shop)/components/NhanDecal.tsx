import { fetchCateAlias } from '@/modules/client/menuApi';
import { Post } from '@/types/contentItem';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
export default async function NhanDecal() {
    let postList: Post[] = [];
    const res = await fetchCateAlias('nhan-decal-' as string, 1, 4);
    postList = res.Data?.list || [];

    return (
        <div className="bg-[#EAF2FE] p-2 md:p-5">
            <h2 className="text-2xl md:text-[32px] font-semibold text-center ">
                NHÃN DECAL
            </h2>
            <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[255px] mb-5 sm:w-[255px]"></div>
            <div className="grid grid-cols-2 gap-4 items-stretch">
                {postList.slice(0, 4).map((label, i) => (
                    <Link href={`${label.alias + '-' + label.id}.html`} key={`${label.id}-${i}`}
                    //  onClick={()=>Cookies.set('activeParent', 'Nhãn Decal')}
                     >
                        <div className="bg-white shadow-custom rounded p-2 flex flex-col h-full">
                            <div className="relative w-full h-[198px] mb-2 rounded overflow-hidden">
                                {label.urls ? (
                                    <Image
                                        src={label.urls}
                                        alt={label.image_desc || "Ảnh sản phẩm"}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-center">
                                        Ảnh không có sẵn
                                    </div>
                                )}
                            </div>
                            <p className="text-[15px] font-normal text-[#2F80ED] text-left p-2.5 w-full min-h-[60px]">
                                {label.content_title}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
