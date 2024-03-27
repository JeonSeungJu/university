import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const AdminColumnForm = () => {
  const modules = {
    toolbar: {
      container: [
        ["image"],
        [{ header: [1, 2, 3, 4, 5, false] }],
        ["bold", "underline"],
      ],
    },
  };

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.currentTarget.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };

  const handleAuthorChange = (e) => {
    setAuthor(e.currentTarget.value);
  };

  const handleImageInserted = (image) => {
    // 이미지가 삽입될 때 호출되는 함수
    // 이미지 파일을 상태에 저장
    setImageFile(image);
  };

  const handleContentChange = (content, delta, source, editor) => {
    setContent(content);
  };

  const handleSubmit = async () => {
    const date = new Date();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('author', author);
    formData.append('content', content);
    formData.append('date', date);
    formData.append('image', imageFile); // 이미지 파일을 FormData에 추가

    try {
      const res = await axios.post('http://localhost:8083/api/board/save-review', formData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <label htmlFor="title">제목</label>
        <input id="title" type="text" onChange={handleTitleChange} />
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
          style={{ width: "800px", height: "600px" }}
          modules={modules}
          onChange={handleContentChange}
          events={{ 'image': handleImageInserted }} // 이미지 삽입 이벤트 핸들러 등록
        />
      </div>
      <button style={{ marginTop: "50px" }} onClick={handleSubmit}>
        제출
      </button>
    </>
  );
};

export default AdminColumnForm;
