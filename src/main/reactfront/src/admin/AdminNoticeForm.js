import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill 스타일시트
import './AdminNoticeForm.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';


const AdminNoticeForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('관리자');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    const noticeData = {
      title,
      writer,
      content,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:8083/api/board/save-notice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noticeData),
      });

      if (response.ok) {
        console.log('Form submitted successfully!');
        navigate(-1);
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
    navigate(-1);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };
  const handleCancel = () => {
    // Navigate back to the previous page or any desired page
    navigate(-1);
  };

  return (
    <div className="board-form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">제목:</label>
        <input type="text" id="title" value={title} onChange={handleTitleChange} />

        <label htmlFor="writer">작성자 이름:</label>
        <input type="text" id="writer" value={writer} onChange={(e) => setWriter(e.target.value)} />

        <label htmlFor="content">내용:</label>
        <ReactQuill value={content} onChange={handleContentChange} />
        <div className="button-container">
          <button type="button" onClick={handleCancel}>
            돌아가기
          </button>
          <button type="button" onClick={handleSubmit}>
          글쓰기
         </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNoticeForm;
