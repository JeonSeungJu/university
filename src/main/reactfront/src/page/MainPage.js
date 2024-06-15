import React, { useEffect } from 'react';
import './MainPage.css'; // 스타일 파일을 import
import { useSelector } from 'react-redux';
import ReviewCardSlider from '../components/ReviewCardSlider';
import SwipeableViews from 'react-swipeable-views';

const MainPage = () => {
  // Redux에서 로그인 상태를 가져오기
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // 저장된 토큰을 가져오기
  const storedToken = localStorage.getItem('accessToken');

  // 토큰이 있고 로그인 상태라면 사용자 정보 표시
  useEffect(() => {
    if (storedToken && isLoggedIn) {
      // 여기에서 토큰을 해석하거나 필요한 정보를 추출하여 UI에 표시
      const decodedToken = atob(storedToken.split('.')[1]);
      const userEmail = JSON.parse(decodedToken).sub;

      console.log('사용자 이메일:', userEmail);
      // 이제 userEmail 등을 활용하여 UI를 구성하거나 다른 작업을 수행할 수 있습니다.
    }
  }, [storedToken, isLoggedIn]);

  useEffect(() => {
    console.log('현재 토큰:', storedToken);
  }, [storedToken]);

  useEffect(() => {
    console.log('isLoggedIn 로그인:', isLoggedIn);
  }, [storedToken]);

  return (
    <div className="main-container">
      <img src="main.png" alt="Main Image" className="main-image" />
      <div className="text-content">
        <h2>Study With Us!</h2>
        <p>다양한 전공학위나 자격이 필요하신 “직장인”</p>
        <p>공부에 공부를 하며 편입학을 준비하는 “대학생”</p>
        <p>개인사정으로 입대를 미뤄야 하는 “대한민국 청년”</p>
        <p>“캐나다 이민”을 위한 ECE학습자 분들까지</p>
        <p>모두 “스터디어스”와 함께 성공하였습니다</p>
      </div>
      <div className="image-gallery">
        <img src="image1.jpg" alt="Gallery Image 1" className="gallery-image" />
        <img src="image2.jpg" alt="Gallery Image 2" className="gallery-image" />
        <img src="image3.jpg" alt="Gallery Image 3" className="gallery-image" />
        <img src="image4.jpg" alt="Gallery Image 4" className="gallery-image" />
      </div>
      {/* ReviewCardSlider 컴포넌트 추가 */}
      <ReviewCardSlider />
    </div>
  );
};

export default MainPage;
