import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminReviewForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [goalContent, setGoalContent] = useState('');
  const [mentorContent, setMentorContent] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [imageFile, setImageFile] = useState(null); // 이미지 파일을 저장할 상태 추가
  const quillRef = useRef(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleGoalContentChange = (e) => {
    setGoalContent(e.target.value);
  };

  const handleMentorContentChange = (e) => {
    setMentorContent(e.target.value);
  };

  const handleContentChange = (content) => {
    setReviewContent(content);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // 선택된 파일을 상태에 저장
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('goalContent', goalContent);
    formData.append('mentorContent', mentorContent);
    formData.append('reviewContent', reviewContent);
    formData.append('createdAt', new Date().toISOString());
    if (imageFile) {
      formData.append('file', imageFile); // 이미지 파일을 FormData에 추가
    }

    try {
      await axios.post('http://13.237.172.212:8080/api/board/save-review', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('리뷰 작성이 완료되었습니다.');
      navigate('/review');
    } catch (error) {
      console.error('리뷰 작성 중 오류 발생:', error);
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
    <div>
      <h2>리뷰 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label htmlFor="goalContent">목표과정</label>
          <textarea
            id="goalContent"
            value={goalContent}
            onChange={handleGoalContentChange}
          />
        </div>
        <div>
          <label htmlFor="mentorContent">담당멘토</label>
          <textarea
            id="mentorContent"
            value={mentorContent}
            onChange={handleMentorContentChange}
          />
        </div>
        <div>
          <label htmlFor="reviewContent">수강 후기</label>
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
        <div>
          <label htmlFor="image">이미지 업로드</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">리뷰 작성 완료</button>
      </form>
    </div>
  );
};

export default AdminReviewForm;
