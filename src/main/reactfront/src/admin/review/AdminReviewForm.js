
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminReviewForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [goalContent, setGoalContent] = useState('');
  const [mentorContent, setMentorContent] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('goalContent', goalContent);
    formData.append('mentorContent', mentorContent);
    formData.append('reviewContent', reviewContent);
    formData.append('image', image);
    formData.append('createdAt', new Date().toISOString());
    if (file) {
      formData.append('file', file, file.name);  // 파일 이름 추가
    }
    try {
      await axios.post('http://localhost:8083/api/board/save-review', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

     
      console.log('리뷰 작성이 완료되었습니다.');
      navigate(-1);
    } catch (error) {
      console.error('리뷰 작성 중 오류 발생:', error);
    }
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
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="goalContent">목표과정</label>
          <textarea
            id="goalContent"
            value={goalContent}
            onChange={(e) => setGoalContent(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="mentorContent">담당멘토</label>
          <textarea
            id="mentorContent"
            value={mentorContent}
            onChange={(e) => setMentorContent(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="reviewContent">수강 후기</label>
          <textarea
            id="reviewContent"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          />
        </div>
        <div>
        <label htmlFor="file">첨부파일:</label>
        <input type="file" id="file" onChange={handleFileChange} />
        </div>
        <button type="submit">리뷰 작성 완료</button>
      </form>
    </div>
  );
};

export default AdminReviewForm;
