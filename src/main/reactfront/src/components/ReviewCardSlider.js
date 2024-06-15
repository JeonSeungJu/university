import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewCardSlider.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const ReviewCardSlider = () => {
  const [reviews, setReviews] = useState([]);
  const [swiper, setSwiper] = useState(null);
  const navigate = useNavigate();

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
    navigate('/review');
  };

  const handleImageError = (e) => {
    e.target.src = '/path/to/default-image.jpg';
    e.target.alt = '이미지를 로드할 수 없습니다.';
  };

  return (
    <div className="review-card-slider">
      <h3 className="review-title">수강후기</h3>
      <Swiper
        onSwiper={setSwiper}
        spaceBetween={30}
        slidesPerView={3} // 여기서 slidesPerView 값을 조정하여 보여지는 리뷰 개수를 설정할 수 있습니다
        navigation
        loop
        centeredSlides
        onSlideChange={() => {}}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index} className="review-card">
            <div className="review-content">
              {review.ImagePath ? (
                <img src={review.ImagePath} alt="게시물 이미지" onError={handleImageError} />
              ) : (
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
                  이미지가 없습니다.
                </div>
              )}
              <h3>{review.title}</h3>
              <p>{review.content}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="more-button" onClick={handleMoreReviews}>후기 더 보기</button>
    </div>
  );
};

export default ReviewCardSlider;
