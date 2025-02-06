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
       <h2>Study With <span className="highlight">Us!</span></h2>
       <p>다양한 전공학위나 자격이 필요하신 <strong className="blue-text">“직장인”</strong></p>
       <p>공부에 공부를 하며 편입학을 준비하는 <strong className="blue-text">“대학생”</strong></p>
       <p>개인사정으로 입대를 미뤄야 하는 <strong className="blue-text">“대한민국 청년”</strong></p>
       <p>“캐나다 이민”을 위한 <strong className="blue-text">ECE 학습자</strong> 분들까지</p>
       <p>모두 <strong className="blue-bold">스터디어스</strong>와 함께 성공하였습니다</p>
     </div>

     {/* 이미지 갤러리 영역 */}
     <div className="image-gallery">
       {["1.jpg", "2.jpg", "3.jpg", "4.jpg"].map((src, index) => (
         <div key={index} className="gallery-item">
           <img src={src} alt={`Gallery Image ${index + 1}`} className="gallery-image" />
           <div className="divider"></div>
           <p className="gallery-text">설명 텍스트를 여기에 추가하세요.</p>
         </div>
       ))}
     </div>

     {/* 카드 섹션 */}
    <div className="cards-wrapper">
         <div className="cards-container">
           <div className="card">
             <img src="/education-icon.png" alt="교육과정" className="card-icon" />
             <h3>교육과정</h3>
             <p>온/오프라인을 통해 어떤 비전을 이루고 싶으신가요? 알맞은 교육 과정 및 필요한 과정을 소개드립니다.</p>
             <button className="card-button">자세히 보기</button>
           </div>
           <div className="card">
             <img src="/review-icon.png" alt="수강후기" className="card-icon" />
             <h3>수강후기</h3>
             <p>스터디어스와 함께 진행한 이후, 성공적으로 목표를 달성하신 분들의 생생한 후기를 확인해보세요.</p>
             <button className="card-button">자세히 보기</button>
           </div>
         </div>
         </div>
   </div>
 );
};

export default MainPage;