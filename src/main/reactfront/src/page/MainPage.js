import React, { useEffect } from 'react';
import './MainPage.css'; // 스타일 파일을 import
import { useSelector } from 'react-redux';

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
      <div className="overlay">
        <div className="content">
          <button className="main-button">Button 1</button>
          <button className="main-button">Button 2</button>
        </div>
        <div className="text-content">
          <h1>Study With Us!</h1>
          <p>다양한 전공학위나 자격이 필요하신 “직장인”</p>
          <p>공부에 공부를 하며 편입학을 준비하는 “대학생”</p>
          <p>개인사정으로 입대를 미뤄야 하는 “대한민국 청년”</p>
          <p>“캐나다 이민”을 위한 ECE학습자 분들까지</p>
          <p>모두 “스터디어스”와 함께 성공하였습니다</p>
        </div>
        <div className="image-gallery">
          <img src="image1.jpg" alt="Gallery Image 1" />
          <img src="image2.jpg" alt="Gallery Image 2" />
          <img src="image3.jpg" alt="Gallery Image 3" />
          <img src="image4.jpg" alt="Gallery Image 4" />
        </div>
      </div>
      <div className="info-section">
        <div className="info-block">
          <h2>Information</h2>
          <p>상호 : 스터디어스</p>
          <p>사업자번호 : 482-30-00290</p>
          <p>대표자: 김성윤</p>
          <p>주소 : 서울 중구 충무로4가 125-3 일흥빌딩 7층</p>
        </div>
        <div className="info-block">
          <h2>Get In Touch</h2>
          <p>Email : contact@studius.kr</p>
          <p>Tel: 070-4922-5656</p>
          <p>국민 033201-04-200041 (스터디어스)</p>
        </div>
      </div>
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.9111341194893!2d126.99596241531579!3d37.56104697979907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3f3fcf9d707%3A0x2a264ac4e4da6e91!2z7ISc7Jq47Yq567OE7IucIOyImO2YuOq4sCDslYTrk6g!5e0!3m2!1sko!2skr!4v1622523672807!5m2!1sko!2skr"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Location Map"
        ></iframe>
      </div>
    </div>
  );
};

export default MainPage;
