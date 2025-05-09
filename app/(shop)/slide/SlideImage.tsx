"use client";
import { Carousel } from "antd";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchSlides } from "@/modules/client/hompageApi";
import { Post } from "@/types/contentItem";
import Link from "next/link";

const SlideImage = () => {
  const [slides, setSlides] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const response = await fetchSlides();
        if (response.Code === 200 && response.Data) {
          setSlides(response.Data);
        }
      } catch (error) {
        console.error("Lỗi khi tải slides:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSlides();
  }, []);

  if (loading) {
    return (
      <section
        aria-label="Loading slides"
        className="h-[515px] bg-gray-100 animate-pulse"
      />
    );
  }

  if (!slides.length) {
    return null;
  }

  return (
    <section
      aria-label="Slideshow"
      className="grid grid-cols-1 lg:grid-cols-12 gap-4"
    >
      <div className="lg:col-span-7">
        <Carousel arrows infinite={false} className="mb-2.5">
          {slides.slice(0, 3).map((slide) => (
            <div
              key={slide.id}
              role="group"
              aria-label={`Slide ${slide.title}`}
              className="relative"
            >
              <Link href={`/products/${slide.alias}`} title={slide.title}>
                <Image
                  src={slide.urls || "/images/Carousel.png"}
                  width={764}
                  height={515}
                  alt={slide.title || "Slide image"}
                  title={slide.title}
                  style={{ height: "515px", objectFit: "cover" }}
                  priority={true}
                  loading="eager"
                />
                {/* Overlay title */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-10 w-[500px] bg-white/60 text-[#2f80ed] text-lg font-semibold px-6 py-3 text-center rounded-lg">
                  {slide.title}
                </div>
              </Link>
            </div>
          ))}
        </Carousel>
      </div>

      {/* 3/12 = 25 % */}
      <aside className="lg:col-span-5" aria-label="Related slides">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-full overflow-auto pb-2.5">
          {slides.slice(3, 7).map((item) => (
            <article
              key={item.id}
              className="flex flex-col h-full cursor-pointer bg-white shadow-custom hover:shadow--md transition overflow-hidden"
            >
              <Link href={`/products/${item.alias}`} title={item.title}>
                <Image
                  src={item.urls || "/images/Carousel.png"}
                  alt={item.title || "Slide image"}
                  title={item.title}
                  width={300}
                  height={160}
                  className="h-40 w-full object-cover"
                  priority={true}
                  loading="eager"
                />
                <h3 className="p-3 text-sm font-normal leading-5 line-clamp-2 text-[#2F80ED]">
                  {item.title}
                </h3>
              </Link>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
};

export default SlideImage;
