import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ReviewDetail.css';

const ReviewDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`http://13.237.172.212:8080/api/board/get-review-detail/${id}`);
        setReview(response.data);
      } catch (error) {
        console.error('Error fetching review:', error);
      }
    };

    fetchReview();
  }, [id]);

  useEffect(() => {
    if (review) {
      const hash = location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [location.hash, review]);

  if (!review) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>학생 후기</h2>
      <ul>
        <li><Link to="#goal">목표과정</Link></li>
        <li><Link to="#mentor">담당멘토</Link></li>
        <li><Link to="#review">수강 후기</Link></li>
      </ul>
      <hr />
      <div>
        <h2>{review.title}</h2>
        <div id="goal">
          <h3>목표과정</h3>
          <div dangerouslySetInnerHTML={{ __html: review.goalContent }} />
        </div>
        <div id="mentor">
          <h3>담당멘토</h3>
          <div dangerouslySetInnerHTML={{ __html: review.mentorContent }} />
        </div>
        <div id="review">
          <h3>수강 후기</h3>
          <img src={review.imagePath} alt="게시물 이미지" />
          <div dangerouslySetInnerHTML={{ __html: review.reviewContent }} />
        </div>
      </div>
    </div>
  );
};


export default ReviewDetail;