import React, { useState } from 'react';
import './BoardForm.css'; // Import the CSS file

const BoardForm = () => {
  const [title, setTitle] = useState('');
  const [secret, setSecret] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSecretChange = () => {
    setSecret(!secret);
  };

  const handleAuthorNameChange = (e) => {
    setAuthorName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 글쓰기 로직 추가
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

        <label htmlFor="authorName">작성자 이름:</label>
        <input type="text" id="authorName" value={authorName} onChange={handleAuthorNameChange} />

        <label htmlFor="password">비밀번호:</label>
        <input type="password" id="password" value={password} onChange={handlePasswordChange} />

        <label htmlFor="content">내용:</label>
        <textarea id="content" value={content} onChange={handleContentChange}></textarea>

        <div className="button-container">
          <button type="button">돌아가기</button>
          <button type="submit">글쓰기</button>
        </div>
      </form>
    </div>
  );
};

export default BoardForm;