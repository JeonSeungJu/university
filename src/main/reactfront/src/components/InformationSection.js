// InformationSection.js
import React from 'react';
import './InformationSection.css'; // InformationSection 스타일링을 위한 CSS 파일

const InformationSection = () => {
  return (
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
      <div className="map-container">
        <iframe 
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.920380946683!2d126.9968950156478!3d37.56130147979933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3f8b72c7a03%3A0xe7d09e5f9e2e6f97!2z7ISc7Jq47Yq567OE7IucIOuCqOqzoOuqqOqwgA!5e0!3m2!1sko!2skr!4v1625567805666!5m2!1sko!2skr" 
          width="400" 
          height="300" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default InformationSection;
