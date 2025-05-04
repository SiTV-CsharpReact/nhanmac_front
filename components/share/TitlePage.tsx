import React from 'react';

interface TitlePageProps {
  text: string;
}

const TitlePage: React.FC<TitlePageProps> = ({ text }) => {
  return (
    <h2 className="text-[#2F80ED] border-l-10 pl-2 text-2xl font-semibold uppercase my-5">
      {text}
    </h2>
  );
};

export default TitlePage;
