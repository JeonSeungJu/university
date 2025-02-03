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
          <div className="text-center mt-20">
        <h1 className="text-4xl font-bold">스터디어스와</h1>
        <h2 className="text-3xl text-blue-600 font-semibold">Study With Us!</h2>
        <p className="text-lg mt-4">
          다양한 전공학위나 자격이 필요하신 <strong className="text-blue-600">“직장인”</strong>
        </p>
        <p className="text-lg">
          공부에 공부를 하며 편입학을 준비하는 <strong className="text-blue-600">“대학생”</strong>
        </p>
        <p className="text-lg">
          개인사정으로 입대를 미뤄야 하는 <strong className="text-blue-600">“대한민국 청년”</strong>
        </p>
        <p className="text-lg">
          <strong className="text-blue-600">“캐나다 이민”</strong>을 위한 ECE학습자 분들까지
        </p>
        <p className="text-lg font-semibold text-gray-700">
          모두 <strong className="text-blue-600">“스터디어스”</strong>와 함께 성공하였습니다.
        </p>
      </div>

      {/* 이미지 갤러리 */}
      <div className="image-gallery mt-10 flex justify-center gap-4">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="gallery-item text-center">
            <img src={`${num}.jpg`} alt={`Gallery ${num}`} className="w-64 h-40 rounded-lg shadow-lg" />
            <p className="text-sm text-gray-600 mt-2">
              {num === 1 && "언제 어디서나 온라인 수강 가능!"}
              {num === 2 && "1:1 전문 담당 튜터 배정"}
              {num === 3 && "요점 정리 가이드 파일 제공"}
              {num === 4 && "원하는 전공 모두 이수 가능!"}
            </p>
          </div>
        ))}
      </div>

      {/* 카드 섹션 */}
      <div className="relative flex justify-center items-center mt-20">
        <div
          className="absolute inset-x-0 bottom-0 h-64 bg-cover bg-center blur-md"
          style={{ backgroundImage: "url('/background.jpg')" }}
        ></div>
        <div className="relative flex gap-8 p-10 bg-white bg-opacity-80 shadow-lg rounded-xl">
          <Card
            icon="/education-icon.png"
            title="교육과정"
            description="온/오프라인을 통해 어떤 비전을 이루고 싶으신가요? 알맞은 교육 과정 및 필요한 과정을 소개드립니다."
            buttonText="자세히 보기"
            buttonColor="bg-blue-600 hover:bg-blue-700"
          />
          <Card
            icon="/review-icon.png"
            title="수강후기"
            description="스터디어스와 함께 진행한 이후, 성공적으로 목표를 달성하신 분들의 생생한 후기를 확인해보세요."
            buttonText="자세히 보기"
            buttonColor="bg-purple-600 hover:bg-purple-700"
          />
        </div>
      </div>

      {/* 후기 슬라이더 */}
      <ReviewCardSlider />
    </div>
  );
};

export default MainPage;