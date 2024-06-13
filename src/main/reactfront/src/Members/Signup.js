import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [globalError, setGlobalError] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    const nameRegex = /^[가-힣a-zA-Z]+$/; // 한글 또는 영문자만 허용
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // 특수 기호 확인

    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmail(value);
        setEmailError(emailRegex.test(value) ? '' : '올바른 이메일 주소를 입력해주세요.');
        break;
      case 'phone':
        const phoneRegex = /^\d{11}$/;
        setPhone(value);
        setPhoneError(phoneRegex.test(value) ? '' : '전화번호를 11자리의 숫자로 입력해주세요.');
        break;
      case 'password':
        setPassword(value);
        setPasswordError(value.length >= 6 ? '' : '비밀번호는 최소 6자 이상이어야 합니다.');
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        setConfirmPasswordError(value === password ? '' : '비밀번호가 일치하지 않습니다.');
        break;
      case 'name':
        setName(value);
        setNameError(nameRegex.test(value) ? '' : '올바른 이름을 입력해주세요.');
        break;
      default:
        break;
    }
  };

  const handleSignup = async () => {
    if (emailError || phoneError || passwordError || confirmPasswordError) {
      setGlobalError('양식을 올바르게 입력해주세요.');
      return;
    }

    // 모든 입력 칸이 채워져 있는지 확인
    if (!name || !phone || !email || !password || !confirmPassword) {
      setGlobalError('모든 칸을 채워주세요.');
      return;
    }

    try {
      const response = await fetch('http://3.106.45.125:8080/api/members/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
          confirmPassword,
        }),
      });

      if (response.ok) {
        // 성공적으로 저장된 경우의 처리
        setGlobalError('회원가입이 성공적으로 완료되었습니다.');
        navigate('/'); // 회원가입 성공 시 / 경로로 이동
      } else {
        // 저장 실패 시의 처리
        setGlobalError('회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      setGlobalError('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="signup-container">
      <label className="form-label">
        이름<span style={{ color: 'red' }}>*</span>:
        <input className="form-input" type="text" name="name" value={name} onChange={handleInputChange} />
        {nameError && <p className="error-message">{nameError}</p>}
      </label>
      <br />

      <label className="form-label">
        Phone<span style={{ color: 'red' }}>*</span>:
        <input className="form-input" type="tel" name="phone" value={phone} onChange={handleInputChange} />
        {phoneError && <p className="error-message">{phoneError}</p>}
      </label>
      <br />

      <label className="form-label">
        Email<span style={{ color: 'red' }}>*</span>:
        <input className="form-input" type="email" name="email" value={email} onChange={handleInputChange} />
        {emailError && <p className="error-message">{emailError}</p>}
      </label>
      <br />

      <label className="form-label">
        비밀번호<span style={{ color: 'red' }}>*</span>:
        <input className="form-input" type="password" name="password" value={password} onChange={handleInputChange} />
        {passwordError && <p className="error-message">{passwordError}</p>}
      </label>
      <br />

      <label className="form-label">
        비밀번호 체크<span style={{ color: 'red' }}>*</span>:
        <input className="form-input" type="password" name="confirmPassword" value={confirmPassword} onChange={handleInputChange} />
        {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
      </label>
      <br />

      <button className="form-button" onClick={handleSignup} disabled={!!globalError || !name || !phone || !email || !password || !confirmPassword}>
        회원가입
      </button>

      {globalError && (
        <div className="error-popup">
          <p>{globalError}</p>
          <button onClick={() => setGlobalError('')}>닫기</button>
        </div>
      )}
    </div>
  );
}

export default Signup;
