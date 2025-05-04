'use client'
import React, { useState } from 'react'
import ClientOnlyEditor from './ClientOnlyEditor';
import TextEditor from '@/components/plugin/TextEditor';

const page = () => {
  const [dataContent, setDataContent] = useState();
  const [editorData, setEditorData] = useState('');
  return (
    <div>
      <h1>Soạn thảo bài viết</h1>
      <ClientOnlyEditor />
      <TextEditor
                  content={dataContent}
                  editorData={editorData}
                  setEditorData={setEditorData}
                  // disabled={isDisabledButtonInput}
                />

    </div>
  );
}

export default page