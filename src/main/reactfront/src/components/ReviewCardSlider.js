import React, { useState, useEffect } from 'react';
import './ReviewCardSlider.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const ReviewCardSlider = () => {
  const [reviews, setReviews] = useState([]);
  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://3.106.45.125:8080/api/board/get-review?page=1&size=5');
        if (!response.ok) {
          throw new Error('후기를 불러오는 데 실패했습니다');
        }
        const data = await response.json();
        setReviews(data.contents);
      } catch (error) {
        console.error('데이터를 불러오는 도중 오류가 발생했습니다:', error);
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
        centeredSlides
        onSlideChange={() => {}}
      >
        <h3>수강후기</h3>
        {reviews.map((review, index) => (
          <SwiperSlide key={index} className="review-card">
            <div className="review-content">
              <h3>{review.title}</h3>
              <p>{review.content}</p>
              <p className="author">By {review.author} on {review.date}</p>
              <p className="rating">Rating: {review.rating}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="more-button" onClick={handleMoreReviews}>후기 더 보기</button>
    </div>
  );
};

export default ReviewCardSlider;
