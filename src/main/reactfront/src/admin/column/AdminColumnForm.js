import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminColumnForm = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [file, setFile] = useState(null); 
  const quillRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.getModule('toolbar').addHandler('image', imageHandler);
    }
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.currentTarget.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.currentTarget.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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

  const handleContentChange = (content) => {
    setReviewContent(content);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('author', author);
    formData.append('content', reviewContent); // HTML 형식의 텍스트와 이미지 포함
    formData.append('createdAt', new Date().toISOString());

    if (file) {
      formData.append('file', file);
    }

    try {
      const res = await axios.post('http://13.237.172.212:8080/api/board/save-column', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/column');
    } catch (error) {
      console.error(error);
    }
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
    <>
      <div>
        <label htmlFor="title">제목</label>
        <input id="title" type="text" onChange={handleTitleChange} />
      </div>
      <div>
        <label htmlFor="file">첨부파일:</label>
        <input type="file" id="file" onChange={handleFileChange} />
      </div>
      <div>
        <label htmlFor="category">카테고리</label>
        <input id="category" type="text" onChange={handleCategoryChange} />
      </div>
      <div>
        <label htmlFor="author">작성자</label>
        <input id="author" type="text" onChange={handleAuthorChange} />
      </div>
      <div>
        <ReactQuill
          ref={quillRef}
          style={{ width: '800px', height: '600px' }}
          value={reviewContent}
          modules={modules}
          onChange={handleContentChange}
        />
      </div>
  
      <button style={{ marginTop: "50px" }} onClick={handleSubmit}>
        제출
      </button>
    </>
  );
};

export default AdminColumnForm;
