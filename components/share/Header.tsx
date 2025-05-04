import React from "react";
import Image from "next/image"; // Bắt buộc với Next.js
import Menu from "./Menu";
import MenuTest from "./Menutest";

const Header = () => {
  // Random số lượng người trực tuyến từ 5 - 100
  const onlineCount = Math.floor(Math.random() * 96) + 5;

  return (
    <>
    <header className="sticky top-0 z-40">
      <div className="w-full bg-[#2F80ED] flex justify-center hidden md:flex">
        <div className="container pl-2 py-2 flex flex-wrap items-center text-white text-sm gap-2">
          {/* Điện thoại */}
          <a
            href="tel:0912424368"
            className="flex items-center gap-0.5 hover:underline"
          >
            <Image
              src="/icons/phone-call.svg"
              alt="Phone"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-xl">0912.424.368</span>
          </a>

          {/* Zalo */}
          <a
            href="https://zalo.me/84912424368"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 hover:underline"
          >
            <Image
              src="/icons/Icon_of_Zalo.svg"
              alt="Zalo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com/nhanmac.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 hover:underline"
          >
            <Image
              src="/icons/brand-facebook.svg"
              alt="Facebook"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </a>

          {/* Mail */}
          <a
            href="mailto:info@nhanmac.vn"
            className="flex items-center gap-0.5 hover:underline"
          >
            <Image
              src="/icons/brand-gmail.svg"
              alt="Gmail"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </a>

          {/* Số người trực tuyến */}
          <span className="ml-auto h-7 bg-[#F2F2F2] text-[#27AE60] px-2 py-1 font-normal flex items-center gap-1 border border-[#27AE60] rounded-[5px]">
            <Image
              src="/icons/Rectangle.svg"
              alt="Online"
              width={10}
              height={10}
              className="w-2.5 h-2.5"
            />
            {onlineCount} Trực tuyến
          </span>
        </div>
      </div>
      {/* <Menu /> */}
      <MenuTest/>
      </header>
    </>
  );
};

export default Header;
