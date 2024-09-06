
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill 스타일시트
import './BoardForm.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const BoardForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [secret, setSecret] = useState(false);
  const [writer, setWriter] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('secret', secret);
    formData.append('writer', writer);
    formData.append('password', password);
    formData.append('content', content);
    formData.append('createdAt', new Date().toISOString());
    // 파일이 선택되었을 때만 FormData에 추가
    if (file) {
      formData.append('file', file, file.name);  // 파일 이름 추가
    }
    try {
      const response = await fetch('http://13.237.172.212:8080/api/board/save', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Form submitted successfully!');
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

  const handleSecretChange = () => {
    setSecret(!secret);
  };

  const handleAuthorNameChange = (e) => {
    setWriter(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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

        <div className="option-container">
          <label htmlFor="secret">옵션:</label>
          <div className="checkbox-container">
            <input type="checkbox" id="secret" checked={secret} onChange={handleSecretChange} />
            <label htmlFor="secret">비밀글</label>
          </div>
        </div>

        <label htmlFor="writer">작성자 이름:</label>
        <input type="text" id="writer" value={writer} onChange={handleAuthorNameChange} />

        <label htmlFor="password">비밀번호:</label>
        <input type="password" id="password" value={password} onChange={handlePasswordChange} />

        <label htmlFor="content">내용:</label>
        <ReactQuill value={content} onChange={handleContentChange} />

        <label htmlFor="file">첨부파일:</label>
        <input type="file" id="file" onChange={handleFileChange} />

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

export default BoardForm;
