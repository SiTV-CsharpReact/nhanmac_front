import React from 'react'
import ClientOnlyEditor from './ClientOnlyEditor';

const page = () => {
  return (
    <div>
      <h1>Soạn thảo bài viết</h1>
      <ClientOnlyEditor />
    </div>
  );
}

export default page