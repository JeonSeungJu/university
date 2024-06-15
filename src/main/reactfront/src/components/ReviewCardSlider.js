import React, { useState, useEffect } from 'react';
import './ReviewCardSlider.css';
import SwipeableViews from 'react-swipeable-views';

const ReviewCardSlider = () => {
  const [reviews, setReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://3.106.45.125:8080/api/board/get-review?page=1&size=5');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data.contents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000); // 5초마다 슬라이드 변경

    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleSlideChange = (index) => {
    setActiveIndex(index);
  };

  const handleMoreReviews = () => {
    // 후기 더 보기 버튼 클릭 시 필요한 동작 구현
    console.log('더 많은 후기 보기');
  };

  return (
    <div className="review-card-slider">
      <SwipeableViews enableMouseEvents index={activeIndex} onChangeIndex={handleSlideChange}>
        {reviews.map((review, index) => (
          <div key={index} className="review-card" onClick={() => handleSlideChange((index + 1) % reviews.length)}>
            <h3>{review.title}</h3>
            <p>{review.content}</p>
            <p className="author">By {review.author} on {review.date}</p>
            <p className="rating">Rating: {review.rating}</p>
          </div>
        ))}
      </SwipeableViews>
      <button className="more-button" onClick={handleMoreReviews}>후기 더 보기</button>
    </div>
  );
};

export default ReviewCardSlider;
