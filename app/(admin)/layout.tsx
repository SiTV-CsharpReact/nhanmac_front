import type { Metadata } from "next";
import "../globals.css";
import ScrollToTop from "@/components/share/ScrollToTop";
import HeaderAdmin from "@/components/share/HeaderAdmin";
import Navbar from "@/components/share/Navbar";
export const metadata: Metadata = {
  title: "Trang quản trị Admin",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" type="image/png" sizes="32x32" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
      </head>
      <body >

        <HeaderAdmin />
        <div className="flex">
        <Navbar />
        {children}
        </div>
   
        <ScrollToTop />

        {/* {children} */}
      </body>
    </html>
  );
}
