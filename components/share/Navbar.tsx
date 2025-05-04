'use client'
import React from 'react';
// import './index.css';
import {  ContainerOutlined, FileImageOutlined, HddOutlined, MenuOutlined, } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useRouter } from 'next/navigation'; // Next.js 13 app router
type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: '/dashboard/menu',
        label: 'Quản lý menu',
        icon: <MenuOutlined />,
        // children: [         
        //         { key: '1', label: 'Danh sách menu  ' },
           
        // ],
    },
    {
        key: '/dashboard/posts',
        label: 'Quản lý slider',
        icon: <FileImageOutlined />,
    },
    {
        key: '/dashboard/category',
        label: 'Quản lý chuyên mục',
        icon: <HddOutlined />,
    },
    {
        key: '/dashboard/article',
        label: 'Quản lý bài viết',
        icon: <ContainerOutlined /> ,
    },
    {
        type: 'divider',
    },
    // {
    //     key: 'sub4',
    //     label: 'Navigation Three',
    //     icon: <SettingOutlined />,
    //     children: [
    //         { key: '9', label: 'Option 9' },
    //         { key: '10', label: 'Option 10' },
    //         { key: '11', label: 'Option 11' },
    //         { key: '12', label: 'Option 12' },
    //     ],
    // },
   
];

const Navbar: React.FC = () => {
    const router = useRouter();

    const onClick: MenuProps['onClick'] = (e) => {
      
        router.push(e.key); // chuyển hướng đến đường dẫn tương ứng với key
    };
    return (
        <Menu
            onClick={onClick}
            style={{ width: 256 }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
        />
    );
};

export default Navbar;