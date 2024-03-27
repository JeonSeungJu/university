// src/components/ReviewDetail.js
import React from 'react';
import { Link } from 'react-router-dom';

const ReviewDetail = () => {
  return (
    <div>
      <h2>학생 후기</h2>
      <ul>
        <li><Link to="/student-review#goal">목표과정</Link></li>
        <li><Link to="/student-review#mentor">담당멘토</Link></li>
        <li><Link to="/student-review#review">수강 후기</Link></li>
      </ul>
      <hr />
      <div id="goal">
        <h3>목표과정</h3>
        {/* 목표과정 내용 */}
      </div>
      <div id="mentor">
        <h3>담당멘토</h3>
        {/* 담당멘토 내용 */}
      </div>
      <div id="review">
        <h3>수강 후기</h3>
        {/* 수강 후기 내용 */}
      </div>
    </div>
  );
};

export default ReviewDetail;
