'use client';

import React, { useEffect, useState } from 'react';

interface TitlePageProps {
  text: string;
}

const TitlePage: React.FC<TitlePageProps> = ({ text }) => {
  const [activeParent, setActiveParent] = useState<string | null>(null);

  useEffect(() => {
    const storedValue = localStorage.getItem('activeParent');
    if (storedValue) {
      setActiveParent(storedValue);
    }
  }, []);

  return (
    <div>
      <h2 className="text-[#2F80ED] border-l-10 pl-2 text-2xl font-semibold uppercase my-5">
        {activeParent}
      </h2>

      {/* Hiển thị nếu cần */}
      {/* {activeParent && (
        <p className="text-gray-500 text-sm">
          Mục cha đang active: <strong>{activeParent}</strong>
        </p>
      )} */}
    </div>
  );
};

export default TitlePage;
