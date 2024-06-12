// ConsultationSection.js
import React from 'react';
import ContactForm from './ContactForm';
import './ConsultationSection.css'; // ConsultationSection 스타일링을 위한 CSS 파일

const ConsultationSection = () => {
  return (
    <div className="consultation-section-container">
      <div className="main-content">
        <h2>시작부터 끝까지, 전담 책임제</h2>
        <h3>스터디어스 컨설팅</h3>
        <p>
          학점은행제 과정에서도 잘못된 컨설팅으로 피해 사례가 있다는 것을 알고 계신가요?
        </p>
        {/* ... (이전 코드와 동일) */}
      </div>
      <ContactForm />
    </div>
  );
};

export default ConsultationSection;
