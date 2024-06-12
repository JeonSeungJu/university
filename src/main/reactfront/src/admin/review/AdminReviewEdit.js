import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminReviewEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [goalContent, setGoalContent] = useState('');
  const [mentorContent, setMentorContent] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [imageFile, setImageFile] = useState(null); // 이미지 파일을 저장할 상태 추가
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태 추가
  const quillRef = React.useRef(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`http://3.106.45.125:8080/api/board/get-review/${id}`);
        const data = response.data;
        setTitle(data.title);
        setGoalContent(data.goalContent);
        setMentorContent(data.mentorContent);
        setReviewContent(data.reviewContent);
        setIsLoading(false); // 데이터 로딩 완료
      } catch (error) {
        console.error('Error fetching review:', error);
        setIsLoading(false); // 데이터 로딩 완료
      }
    };

    fetchReview();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') setTitle(value);
    else if (name === 'goalContent') setGoalContent(value);
    else if (name === 'mentorContent') setMentorContent(value);
  };

  const handleContentChange = (content) => {
    setReviewContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('goalContent', goalContent);
    formData.append('mentorContent', mentorContent);
    formData.append('reviewContent', reviewContent);
    if (imageFile) {
      formData.append('file', imageFile); // 이미지 파일을 FormData에 추가
    }

    try {
      await axios.put(`http://3.106.45.125:8080/api/board/update-review/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('리뷰 수정이 완료되었습니다.');
      navigate('/review'); // '/review' 페이지로 이동
    } catch (error) {
      console.error('리뷰 수정 중 오류 발생:', error);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>리뷰 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="goalContent">목표과정</label>
          <textarea
            id="goalContent"
            name="goalContent"
            value={goalContent}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="mentorContent">담당멘토</label>
          <textarea
            id="mentorContent"
            name="mentorContent"
            value={mentorContent}
            onChange={handleChange}
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
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        <button type="submit">리뷰 수정 완료</button>
      </form>
    </div>
  );
};

export default AdminReviewEdit;