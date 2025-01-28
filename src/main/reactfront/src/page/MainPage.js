import React, { useEffect } from 'react';
import './MainPage.css'; // 스타일 파일을 import
import { useSelector } from 'react-redux';
import ReviewCardSlider from '../components/ReviewCardSlider';
import './ConsultButtons.css';

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
          <div className="consult-buttons-container">
            <button className="consult-button yellow">
              <span role="img" aria-label="chat">
                💬
              </span>{' '}
              채팅상담 바로가기
            </button>
            <button className="consult-button blue">
              <span role="img" aria-label="phone">
                📞
              </span>{' '}
              전화상담 바로가기
            </button>
          </div>
       <div className="text-content">
         <h1>스터디어스와</h1>
         <h2>Study With Us!</h2>
         <p>다양한 전공학위나 자격이 필요하신 <strong>“직장인”</strong></p>
         <p>공부에 공부를 하며 편입학을 준비하는 <strong>“대학생”</strong></p>
         <p>개인사정으로 입대를 미뤄야 하는 <strong>“대한민국 청년”</strong></p>
         <p><strong>“캐나다 이민”</strong>을 위한 ECE학습자 분들까지</p>
         <p>모두 <strong>“스터디어스”</strong>와 함께 성공하였습니다</p>
       </div>
      <div className="image-gallery">
        <div className="gallery-item">
          <img src="1.jpg" alt="Gallery Image 1" className="gallery-image" />
          <p className="gallery-text">언제 어디서나 온라인 수강 가능!<br />직장에서, 학원에서, 집에서도<br />간편한 모바일 수강으로!</p>
        </div>
        <div className="gallery-item">
          <img src="2.jpg" alt="Gallery Image 2" className="gallery-image" />
          <p className="gallery-text">1:1 전문 담당 튜터 배정<br />개인번호 24시간 / 365일 밀착</p>
        </div>
        <div className="gallery-item">
          <img src="3.jpg" alt="Gallery Image 3" className="gallery-image" />
          <p className="gallery-text">요점 정리 가이드 파일 제공<br />대학과정이 처음이라도 문제없이<br />이수할 수 있게 다양한 참고자료 제공!</p>
        </div>
        <div className="gallery-item">
          <img src="4.jpg" alt="Gallery Image 4" className="gallery-image" />
          <p className="gallery-text">원하는 전공 모두 이수 가능!<br />공학과목이 없는 온라인에서도<br />학위 취득 가능!</p>
        </div>
      </div>

      {/* ReviewCardSlider 컴포넌트 추가 */}
      <ReviewCardSlider />
    </div>
  );
};

export default MainPage;
