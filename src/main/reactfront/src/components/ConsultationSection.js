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
        <p>
          스터디어스의 체계적인 컨설팅과 전담 상담원을 통해서 신뢰성 있는 컨설팅을 제공합니다.
        </p>
        <p>
          스터디어스는 한 번의 상담으로 만족스럽지 않으셨던 많은 분들에게 신뢰성 있는 컨설팅을 제공하며
          과정 설계와 학습과정에서의 어려움, 학점은행제 과정에 대한 정보를 정확하게 제공합니다.
        </p>
      </div>
      <ContactForm />
      <div className="map-container">
        <h2>위치 안내</h2>
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

export default ConsultationSection;
