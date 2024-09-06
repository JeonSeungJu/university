
import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AdminNoticeForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminNoticeForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('관리자');
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');
  const quillRef = useRef(null);
  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.getModule('toolbar').addHandler('image', imageHandler);
    }
  }, []);
  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://13.237.172.212:8080/api/board/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const imageUrl = response.data;
      return imageUrl;
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error);
      return null;
    }
  };
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', imageUrl);
      }
    };
  };

  const handleSubmit = async () => {
    const noticeData = {
      title,
      writer,
      content,
      imageUrl: imageURL,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://13.237.172.212:8080/api/board/save-notice', {
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
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <div className="board-form-container">
      <form>
        <label htmlFor="title">제목:</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label htmlFor="writer">작성자 이름:</label>
        <input type="text" id="writer" value={writer} onChange={(e) => setWriter(e.target.value)} />

        <label htmlFor="content">내용:</label>
        <div>
          <ReactQuill
            ref={quillRef}
            style={{ width: '800px', height: '400px' }}
            value={content}
            modules={modules}
            onChange={handleContentChange}
            formats={['image']}
            placeholder="내용을 입력하세요..."
          />
        </div>

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
