import Image from "next/image";
import { Carousel } from "antd";
import CountUpNumber from "@/components/share/CountUpNumber";
import styles from "./Carousel.module.css"; //
import SlideImage from "./slide/SlideImage";

const testimonials = [
  {
    comment:
      "Sản phẩm tem nhãn của 3A vượt trội so với các đơn vị khác. Chất lượng, bền màu và đặc biệt là dịch vụ tư vấn rất tận tâm.",
    author: "Ms. Nguyễn Thị An - Công ty May Mặc ABC",
    company: "Công ty May Mặc ",
  },
  {
    comment:
      "3A đã giúp chúng tôi có những mẫu tem nhãn đẹp, ấn tượng. Rất hài lòng về sự chuyên nghiệp và sáng tạo của đội ngũ thiết kế.",
    author: "Mr. Trần Văn Bình - Cơ sở Da Giày XYZ",
    company: "Cơ sở Da Giày ",
  },
  {
    comment:
      "Chúng tôi đánh giá cao sự uy tín và chất lượng của 3A. Tem nhãn được giao đúng hẹn, chất lượng đảm bảo, giá cả cạnh tranh.",
    author: "Mrs. Lê Thị Cúc - HTX Nông Sản",
    company: "HTX Nông Sản 123",
  },
];

const sections = [{ title: "TEM KIM LOẠI" }];

const sections2 = [{ title: "TEM NHỰA DA-MICA" }, { title: "TEM QR CODE" }];
const sections3 = [{ title: "TEM NGÀNH NGHỀ" }];

const labels = [
  {
    image: "/images/tem-kim-loai.png",
    imageAlt: "Ảnh tem kim loại",
    label: "Tem nhựa da làm logo nhãn mác tag name plate máy móc",
  },
  {
    image: "/images/tem-kim-loai.png",
    imageAlt: "Ảnh tem nhựa da-mica",
    label: "Tem nhựa da làm logo nhãn mác tag name plate máy móc",
  },
  {
    image: "/images/tem-kim-loai.png",
    imageAlt: "Ảnh tem QR code",
    label: "Tem nhựa da làm logo nhãn mác tag name plate máy móc",
  },
  {
    image: "/images/tem-kim-loai.png",
    imageAlt: "Ảnh nhãn vải",
    label: "Tem nhựa da làm logo nhãn mác tag name plate máy móc",
  },
  {
    image: "/images/tem-kim-loai.png",
    imageAlt: "Ảnh nhãn decal",
    label: "Tem nhựa da làm logo nhãn mác tag name plate máy móc",
  },
];

export default function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Thời gian chuyển slide (milliseconds)
    arrows: false, // Ẩn mũi tên
    className: styles.carouselContainer, // Thêm class vào carousel
    dotsClass: `${styles.dots} slick-dots`,
  };
  return (
    <main className="m-auto grid place-items-center">
      {/* 12 cột, gap tuỳ ý */}
      <div className="container my-4">
        <SlideImage/>
        <div className="text-center text-[28px] mt-8 font-semibold md:text-[32px]">
          <span>Bạn đang tìm đơn vị sản xuất tem nhãn uy tín?</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 mt-6 px-1 md:px-20 gap-1 md:gap-0 ">
          <div className="flex flex-col gap-1 text-[#2F80ED] col-span-1 md:col-span-4 md:gap-6">
            {/* Kinh nghiệm */}
            <div className="flex items-center gap-4">
              <div className="w-21.5 h-21.5 rounded-full bg-[#62A3FC] border-2 border-[#2F80ED] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-3 border-[#fff]">
                  <div className="relative mt-1 text-[46px] font-semibold text-white">
                    <span className="absolute left-3 tracking-[-4px]">10</span>
                    <span className="absolute text-2xl font-bold left-13 top-3.5">
                      <Image src="/icons/+.svg" width={12} height={12} alt="" />
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-base font-medium animate-subtitle">
                Hơn 10 năm năm kinh nghiệm
              </span>
            </div>

            {/* Số lượng khách hàng */}
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <div className="w-21.5 h-21.5 rounded-full bg-[#62A3FC] border-2 border-[#2F80ED] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-3 border-[#fff]">
                  <div className="relative text-[19px] font-semibold text-white">
                    <span className="absolute left-0.5 top-5 tracking-[-1px]">
                      <CountUpNumber
                        end={20000}
                        suffix={
                          <Image
                            src="/icons/+.svg"
                            width={11}
                            height={11}
                            alt=""
                            className="absolute left-14.5 top-0.5"
                          />
                        }
                        duration={2}
                      />
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-base font-medium animate-subtitle">
                Với khoảng hơn 20.000 khách hàng đã tin tưởng và sử dụng
              </span>
            </div>
          </div>
          <div className="col-span-1 md:col-span-8 md:ml-39 text-center md:text-right mt-2 md:mt-0">
            <div className="text-right mb-12">
              <span className="text-[#2F80ED] font-semibold text-2xl">
                CÔNG TY CỔ PHẦN CÔNG NGHỆ THIÊN LƯƠNG
              </span>
              <br />
              <span className="block max-w-3xl mx-auto text-base font-medium mt-4.5">
                Với phương châm &quot;Nỗ lực hết mình vì mục tiêu khách hàng đặt
                ra&quot; vì thế chúng tôi không ngừng hoàn thiện mình, nâng cấp,
                đổi mới trang thiết bị máy móc, tăng cường khả năng sáng tạo,
                biết lắng nghe để rồi từ đó thấu hiểu được ý tưởng và đáp ứng
                yêu cầu Quý khách. Tem nhãn mác của chúng tôi sẽ góp phần nâng
                cao giá trị sản phẩm của bạn
              </span>
              <div className="mt-2">
                <a className="flex float-right" href="go">
                  <span className="text-[#2F80ED] font-medium text-base mr-0.5">
                    Đọc thêm
                  </span>{" "}
                  <Image
                    className="transform transition-all duration-300 group-hover:translate-x-1 animate-arrow"
                    src={"/icons/arrow-big-right-lines.svg"}
                    width={24}
                    height={27}
                    alt="go"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mb-13 mt-10">
        <div className="p-1 py-2 md:p-6 space-y-12 bg-[#EAF2FE] grid place-items-center">
          <div className="container">
            {sections.map((section, idx) => (
              <div key={idx} className="text-center">
                <h2 className="text-2xl md:text-[32px] font-semibold text-center inline-block ">
                  {section.title}
                </h2>
                <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[255px] mb-5 sm:w-[255px]"></div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {labels.map((label, i) => (
                    <div
                      key={i}
                      className="bg-white shadow-custom p-0 flex flex-col items-center"
                    >
                      <div className="w-full  bg-gray-100 mb-2 flex items-center justify-center">
                        {/* Chèn hình ảnh ở đây */}
                        <Image
                          src={label?.image}
                          alt={label?.imageAlt || "Ảnh sản phẩm"} // Thêm alt mặc định
                          height={173}
                          width={245}
                        />
                      </div>
                      <p className="text-[15px] font-normal text-[#2F80ED] text-left p-2.5">
                        {label?.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="  p-1 py-2 md:pb-6 space-y-12 grid place-items-center">
          <div className="container">
            {sections2.map((section, idx) => (
              <div key={idx} className="text-center py-2 md:my-10 ">
                <h2 className="text-2xl md:text-[32px] font-semibold text-center inline-block ">
                  {section.title}
                </h2>
                <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[255px] mb-5 sm:w-[255px]"></div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {labels.map((label, i) => (
                    <div
                      key={i}
                      className="bg-white shadow-custom rounded p-2 flex flex-col items-center"
                    >
                      <div className="w-full h-24 bg-gray-100 mb-2 flex items-center justify-center">
                        {/* Chèn hình ảnh ở đây */}
                        <span className="text-gray-400">Ảnh</span>
                      </div>
                      <p className="text-xs text-center">{label?.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid place-items-center">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#EAF2FE] p-2 md:p-5">
                <h2 className="text-2xl md:text-[32px] font-semibold text-center ">
                  NHÃN VẢI
                </h2>
                <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[255px] mb-5 sm:w-[255px]"></div>
                <div className="grid grid-cols-2 gap-4">
                  {labels.slice(0, 4).map((label, i) => (
                    <div
                      key={i}
                      className="bg-white shadow-custom rounded p-2 flex flex-col items-center"
                    >
                      <div className="w-full h-24 bg-gray-100 mb-2 flex items-center justify-center">
                        <span className="text-gray-400">Ảnh</span>
                      </div>
                      <p className="text-xs text-center">{label?.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#EAF2FE] p-2 md:p-5">
                <h2 className="text-2xl md:text-[32px] font-semibold text-center ">
                  NHÃN DECAL
                </h2>
                <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[255px] mb-5 sm:w-[255px]"></div>
                <div className="grid grid-cols-2 gap-4">
                  {labels.slice(0, 4).map((label, i) => (
                    <div
                      key={i}
                      className="bg-white shadow-custom rounded p-2 flex flex-col items-center"
                    >
                      <div className="w-full h-24 bg-gray-100 mb-2 flex items-center justify-center">
                        <span className="text-gray-400">Ảnh</span>
                      </div>
                      <p className="text-xs text-center">{label?.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="  p-1 py-2 md:pb-6 space-y-12 grid place-items-center">
          <div className="container">
            {sections3.map((section, idx) => (
              <div key={idx} className="text-center py-2 md:my-10 ">
                <h2 className="text-2xl md:text-[32px] font-semibold text-center inline-block ">
                  {section.title}
                </h2>
                <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[255px] mb-5 sm:w-[255px]"></div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {labels.map((label, i) => (
                    <div
                      key={i}
                      className="bg-white shadow-custom rounded p-2 flex flex-col items-center"
                    >
                      <div className="w-full h-24 bg-gray-100 mb-2 flex items-center justify-center">
                        {/* Chèn hình ảnh ở đây */}
                        <span className="text-gray-400">Ảnh</span>
                      </div>
                      <p className="text-xs text-center">{label?.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid place-items-center">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-[#EAF2FE] pb-1.5 px-2 md:px-5 pt-5">
                <h2 className="text-2xl md:text-[32px] font-semibold text-center ">
                  CẢM NHẬN KHÁCH HÀNG
                </h2>
                <div className="h-1 bg-[#2F80ED] mx-auto w-[255px] mb-2.5"></div>
                <Carousel {...settings} className="pb-9">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white">
                      <div className="grid grid-cols-12 gap-5 p-5">
                        {/* Logo hoặc icon */}
                        <div className="col-span-2 flex items-start gap-2">
                          <Image
                            src="/icons/Vector.svg"
                            width={41}
                            height={18}
                            alt=""
                            className="h-10 w-10 md:h-15 md:w-10"
                          />
                          <Image
                            src="/icons/Vector.svg"
                            width={41}
                            height={18}
                            alt=""
                            className="h-10 w-10 md:h-15 md:w-10"
                          />
                        </div>

                        {/* Nội dung */}
                        <div className="col-span-10  ml-4">
                          <span className="block  text-base text-gray-700 leading-relaxed leading-[22px]">
                            {testimonial.comment}
                          </span>

                          {/* Rating */}
                          <div className="flex gap-1 pb-1.5 pt-0.5 mb-2 border-b-1 border-[#CFCFCF]">
                            {[...Array(5)].map((_, index) => (
                              <Image
                                key={index}
                                src="/icons/star.svg"
                                width={24}
                                height={24}
                                alt="star"
                              />
                            ))}
                          </div>
                          <div className="mb-3">
                            <span className="text-base font-bold">
                              {testimonial.author} - {testimonial.company}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Carousel>
              </div>

              <div className="bg-[#EAF2FE] p-2 md:p-5">
                <h2 className="text-2xl md:text-[32px] font-semibold text-center ">
                  TIN TỨC
                </h2>
                <div className="h-1 bg-[#2F80ED] mx-auto w-1/2 max-w-[255px] mb-5 sm:w-[255px]"></div>
                <div className="grid grid-cols-2 gap-4">
                  {labels.slice(0, 2).map((label, i) => (
                    <div
                      key={i}
                      className="bg-white shadow-custom rounded p-2 flex flex-col items-center"
                    >
                      <div className="w-full h-24 bg-gray-100 mb-2 flex items-center justify-center">
                        <span className="text-gray-400">Ảnh</span>
                      </div>
                      <p className="text-xs text-center">{label?.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
