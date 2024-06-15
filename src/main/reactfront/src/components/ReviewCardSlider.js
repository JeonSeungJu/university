import React, { useState, useEffect } from 'react';
import './ReviewCardSlider.css';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

SwiperCore.use([Navigation]);

const ReviewCardSlider = () => {
  const [reviews, setReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState(null);

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
      swiper?.slideNext();
    }, 5000); // 5초마다 슬라이드 변경

    return () => clearInterval(interval);
  }, [swiper]);

  const handleSlideChange = () => {
    if (swiper) {
      setActiveIndex(swiper.realIndex);
    }
  };

  const handleMoreReviews = () => {
    // 후기 더 보기 버튼 클릭 시 필요한 동작 구현
    console.log('더 많은 후기 보기');
  };

  return (
    <div className="review-card-slider">
      <Swiper
        onSwiper={setSwiper}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        loop
        onSlideChange={handleSlideChange}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index} className="review-card">
            <h3>{review.title}</h3>
            <p>{review.content}</p>
            <p className="author">By {review.author} on {review.date}</p>
            <p className="rating">Rating: {review.rating}</p>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="more-button" onClick={handleMoreReviews}>후기 더 보기</button>
    </div>
  );
};

export default ReviewCardSlider;
