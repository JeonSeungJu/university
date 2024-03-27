import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from 'react-js-pagination'; // 패키지 추가
import './ReviewList.css';

const ReviewList = () => {
    const [learners, setLearners] = useState([]);

    useEffect(() => {
      // 가상의 서버 URL (실제 서버 URL로 변경해야 함)
      const serverUrl = 'https://example.com/api/learners';
  
      // 서버에서 데이터 가져오기
      fetch(serverUrl)
        .then(response => response.json())
        .then(data => setLearners(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);
  
    return (
      <div className="app">
        <div className="card-container">
          {learners.map((learner, index) => (
            <Card key={index} learner={learner} />
          ))}
        </div>
      </div>
    );
  }
  
  function Card({ learner }) {
    return (
      <div className="card">
        <img src={learner.imageUrl} alt={`Image of ${learner.name}`} />
        <p className="name">{learner.name}</p>
        <p className="description">{learner.description}</p>
      </div>
    );
  }
export default ReviewList;