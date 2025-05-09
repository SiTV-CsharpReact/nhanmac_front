"use client";

import Image from "next/image";
import React from "react";
import { Form, Input, Button, message } from "antd";
import "../globals.css";
import {  useRouter } from 'next/navigation';
import { login } from "@/modules/admin/loginApi";
import Cookies from 'js-cookie';
import '@ant-design/v5-patch-for-react-19';
// import { login } from "@/api/authApi"; // ✅ Gọi API login từ file riêng

const Page = () => {
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      const data = await login(values); // ✅ Dùng hàm login
      message.success("Đăng nhập thành công!");
      Cookies.set('access_token', data.Data.usertype); 
      // cookies.setItem("access_token", data.Data.usertype);
      router.push('/dashboard/menu');
    } catch (error: any) {
      message.error(error.message || "Lỗi đăng nhập");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg flex w-full max-w-4xl overflow-hidden">
        {/* Bên trái: Hình ảnh minh họa */}
        <div className="w-1/2 bg-gray-100 hidden md:flex items-center justify-center">
          <Image
            src="/images/login.png"
            width={600}
            height={575}
            alt="not found"
            className="w-full h-full"
            priority
          />
        </div>

        {/* Bên phải: Form login */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Đăng nhập</h2>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Đăng nhập
              </Button>
            </Form.Item>

            <div className="text-right text-sm mt-2">
              <a href="#" className="text-blue-600 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default Page;
