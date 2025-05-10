'use client'
import React from 'react';

import Image from "next/image";
const AdminPostManagement: React.FC = () => {
 

  return (
    <div style={{ padding: 24 }}>
     <Image
            src="/images/login.png"
            width={600}
            height={575}
            alt="not found"
            className="w-full h-full"
            priority
          />
    </div>
  );
};

export default AdminPostManagement;
