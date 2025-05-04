// components/Footer.js
'use client'
import Image from "next/image";
import FacebookPagePlugin from "../plugin/FaceBookPlugin";
// import dynamic from "next/dynamic";

// Dynamic import FacebookGroup, chỉ render trên client
// const FacebookGroup = dynamic(() => import("./FacebookGroup"), { ssr: false });

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white">
   
        <div className="grid grid-cols-1 md:grid-cols-5 gap-14 mx-auto pt-8 container">
          {/* Cột 1: Logo và thông tin công ty */}
          <div className="space-y-3 md:col-span-2">
            <Image
              src="/images/logo.png"
              alt="Thiên Lương"
              width={100}
              height={50}
              className="mb-3"
            />
            <h3 className="font-bold uppercase text-xl">
              CÔNG TY CỔ PHẦN CÔNG NGHỆ THIÊN LƯƠNG
            </h3>
            <p className="flex items-start">
              <Image
                src="/icons/map-2.svg"
                alt="Địa chỉ"
                width={36}
                height={36}
                className="mr-2.5"
              />
              <span>
                Số 41, Phương Liệt, Phường Phương Liệt, Quận Thanh Xuân, TP Hà Nội
              </span>
            </p>

            {/* Hotline */}
            <div className="flex items-center">
              <Image
                src="/icons/phone-call-white.svg"
                alt="Hotline"
                width={36}
                height={36}
                className="mr-2"
              />
              <div>
                <p className="font-bold">Hotline:</p>
                <a href="tel:0912424368" className="text-[#2F80ED]">
                  0912.424.368
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center">
              <Image
                src="/icons/brand-gmail-full.svg"
                alt="Email"
                width={36}
                height={36}
                className="mr-2"
              />
              <div>
                <p className="font-bold">Email:</p>
                <a
                  href="mailto:thienluong@gmail.com"
                  className="hover:text-blue-300"
                >
                  thienluong@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Cột 2: Menu và Facebook Group */}
          <div className="md:col-span-3 pt-6">
            {/* Menu */}
            <div className="flex flex-wrap justify-between text-white text-sm mb-6">
              <h3 className="text-lg font-medium pb-2 cursor-pointer hover:text-blue-400">
                Trang chủ
              </h3>
              <h3 className="text-lg font-medium pb-2 cursor-pointer hover:text-blue-400">
                Giới thiệu
              </h3>
              <h3 className="text-lg font-medium pb-2 cursor-pointer hover:text-blue-400">
                Tin tức
              </h3>
              <h3 className="text-lg font-medium pb-2 cursor-pointer hover:text-blue-400">
                Liên hệ
              </h3>
            </div>

            {/* Zalo và Facebook Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Zalo */}
              <div className="relative">
                <Image
                  src="/images/footer-zalo.png"
                  alt="Zalo QR Code"
                  width={369}
                  height={118}
                  className="rounded"
                />
                <Image
                  src="/icons/Icon_of_Zalo.svg"
                  alt="Icon Zalo"
                  width={70}
                  height={70}
                  className="absolute top-6 left-4"
                />
              </div>

              {/* Facebook Group */}
              <div>
               <FacebookPagePlugin/>
              </div>
            </div>
            <div className="pt-8 flex">
              <Image
                src="/icons/clock.svg"
                alt="Clock"
                width={36}
                height={36}
                className="mr-2"
                />
                 <div>
                <p className="font-bold">Giờ hoạt động:</p>
                <a href="tel:0912424368" className="text-[#2F80ED]">
                Sáng: 8h30 - 12h00 Chiều: 13h30 - 17h30
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-2 mt-6  border-t border-[#CFCFCF] text-center text-sm text-white">
          <p>
            Bản quyền bài viết, hình ảnh trên website thuộc về Công ty Cổ phần
            Công Nghệ Thiên Lương. Nghiêm cấm sao chép dưới mọi hình thức.
          </p>
        </div>
    
    </footer>
  );
};

export default Footer;
