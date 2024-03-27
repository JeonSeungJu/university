import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './AdminReviewDetail.css'; // CSS 파일 임포트

const AdminReviewDetail = () => {
  const [review, setReview] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // 서버에서 리뷰 데이터를 가져오는 함수 호출
    const fetchReview = async () => {
      try {
        const response = await fetch(`http://localhost:8083/api/board/get-review-details/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch review data');
        }
        const data = await response.json();
        setReview(data);
      } catch (error) {
        console.error('Error fetching review data:', error);
      }
    };

    fetchReview();
  }, [id]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <ul>
        <li><button onClick={() => scrollToSection('goal')}>목표과정</button></li>
        <li><button onClick={() => scrollToSection('mentor')}>담당멘토</button></li>
        <li><button onClick={() => scrollToSection('review')}>수강 후기</button></li>
      </ul>
      <hr />
      {review ? (
        <div>
          <h2>{review.title}</h2>
          <div id="goal">
            <h3>목표과정</h3>
            <p>{review.goalContent}</p>
          </div>
          <div id="mentor">
            <h3>담당 멘토</h3>
            <p>{review.mentorContent}</p>
          </div>
          <div id="review" className="review-container">
            <h3>수강 후기</h3>
            {review.imagePath && <img className="review-image" src={review.imagePath} alt="Review Image" />}
            <p>{review.reviewContent}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminReviewDetail;
