import React, { useState } from 'react';
import './ContactForm.css'; // 스타일링을 위한 CSS 파일

const ContactForm = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [kakaoId, setKakaoId] = useState('');
  const [contactTime, setContactTime] = useState('');
  const [text, setText] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('undergraduate');
  const [file, setFile] = useState(null);
  const [agree, setAgree] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'contact') {
      setContact(value);
    } else if (name === 'kakaoId') {
      setKakaoId(value);
    } else if (name === 'contactTime') {
      setContactTime(value);
    } else if (name === 'text') {
      setText(value);
    } else if (name === 'degreeProgram') {
      setDegreeProgram(value);
    } else if (name === 'file') {
      setFile(e.target.files[0]);
    } else if (name === 'agree') {
      setAgree(!agree);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      console.error('개인정보 수집에 동의해야 제출할 수 있습니다.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('contact', contact);
      formData.append('kakaoId', kakaoId);
      formData.append('contactTime', contactTime);
      formData.append('text', text);
      formData.append('degreeProgram', degreeProgram);
      formData.append('file', file);
      formData.append('agree', agree);

      const response = await fetch('http://3.106.45.125:8080/api/contact/submit', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Form submitted successfully');
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
       <div className="contact-form-container">
        <h2>학습컨설팅 문의</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="degreeProgram"></label>
            <select
            id="degreeProgram"
            name="degreeProgram"
            value={degreeProgram}
            onChange={handleInputChange}
            >
            <option value="undergraduate">학사과정</option>
            <option value="graduate">대학원과정</option>
            </select>
            <br />

            <label htmlFor="name"></label>
            <input
            type="text"
            id="name"
            name="name"
            placeholder="성함을 적어주세요"
            value={name}
            onChange={handleInputChange}
            />
            <br />

            <label htmlFor="contact"></label>
            <input
            type="text"
            id="contact"
            name="contact"
            placeholder="연락처를 적어주세요"
            value={contact}
            onChange={handleInputChange}
            />
            <br />

            <label htmlFor="kakaoId"></label>
            <input
            type="text"
            id="kakaoId"
            name="kakaoId"
            placeholder="카톡 아이디를 적어주세요"
            value={kakaoId}
            onChange={handleInputChange}
            />
            <br />

            <label htmlFor="contactTime"></label>
            <input
            type="text"
            id="contactTime"
            name="contactTime"
            placeholder="연락받고 싶은 시간대를 적어주세요"
            value={contactTime}
            onChange={handleInputChange}
            />
            <br />

            <label htmlFor="text"></label>
            <textarea
            id="text"
            name="text"
            placeholder="현재 준비하려는 과정들에 대해서 간략하게 작성해주세요. 궁금하신 사항도 좋습니다. 만약 기타 첨부하고 싶은 추가 내용이 있다면 다음의 '파일선택'을 활용해 파일을 업로드해주세요.
            "
            value={text}
            onChange={handleInputChange}
            />
            <br />

            <label htmlFor="file"></label>
            <input
            type="file"
            id="file"
            name="file"
            onChange={handleInputChange}
            />
            <br />

            <label htmlFor="agree">
            <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={agree}
                onChange={handleInputChange}
            />
            개인정보 수집 동의
            </label>
            <br />

            <button type="submit" className="submit-button">
            제출하기
            </button>
        </form>
        </div>
  );
};

export default ContactForm;
