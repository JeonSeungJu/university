import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Test = ({ token }) => {
  let payload;
  let role; // 'role' 변수 정의
  try {
    if (typeof token === 'string') {
      payload = token.split('.')[1];
      role = JSON.parse(atob(payload)).role; // 역할 정보 추출
    } else {
      console.error('토큰이 문자열이 아닙니다.');
      return <div>토큰이 문자열이 아닙니다.</div>;
    }
  } catch (error) {
    console.error('토큰 분리 중 오류 발생', error);
    return <div>토큰 분리 중 오류 발생</div>;
  }
  let dec = atob(payload);
  return (
    <div>
      <p>Role: {role}</p>
      <p>{dec}</p>
    </div>
  );
};

const LoginForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    console.log('로그아웃 되었습니다.');
  };

  const handleForgotPassword = () => {
    console.log('비밀번호 찾기 클릭');
  };

  const handleSignUp = () => {
    console.log('회원가입 클릭');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://13.237.172.212:8080/api/members/login', {
        email,
        password,
      });
  
      const receivedToken = response.data;
      console.log('receivedToken:', receivedToken);
  
      if (typeof receivedToken.accessToken === 'string') {
        const decodedToken = atob(receivedToken.accessToken.split('.')[1]);
        const role = JSON.parse(decodedToken).role;
  
        console.log('userRole:', role);
  
        dispatch({ type: 'LOGIN_SUCCESS' });
        setToken(receivedToken.accessToken);
        setUserRole(role);
  
        // 토큰을 localStorage에 저장
        window.localStorage.setItem('accessToken', receivedToken.accessToken);
  
        if (role === 'ROLE_USER') {
          window.location.replace("/");
        } else {
          window.location.replace("/");
        }
      } else {
        console.error('로그인 실패: 토큰이 문자열이 아닙니다.');
      }
    } catch (error) {
      console.error('로그인 실패', error);
      alert('로그인에 실패했습니다.');
    }
  };
  
  useEffect(() => {
    // 컴포넌트가 마운트될 때만 localStorage에서 토큰과 이메일을 가져와 설정
    const storedToken = localStorage.getItem('accessToken');
    const storedEmail = localStorage.getItem('email');
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []); // 빈 배열을 넣어 마운트될 때 한 번만 실행되도록 함

  useEffect(() => {
    // 토큰이 변경될 때마다 localStorage에 저장
    if (token) {
      localStorage.setItem('accessToken', token);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const decodedToken = atob(token.split('.')[1]);
      const expirationTime = JSON.parse(decodedToken).exp * 1000;
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        console.log('토큰이 만료되었습니다.');
        handleLogout();
      }
    }
  }, [token]);

  useEffect(() => {
    console.log('isLoggedIn 상태:', rememberMe);
  }, [rememberMe]);

  // 새로고침 시에 콘솔에 현재의 토큰 값 출력
  useEffect(() => {
    console.log('현재 토큰:', token);
  }, [token]);

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit}>
        <label>Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <br />
        <label>Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <br />
        <br />
        <button type="submit">로그인</button>
      </form>
      <div className="login-buttons">
        <button onClick={handleForgotPassword}>비밀번호 찾기</button>
        <button onClick={handleSignUp}>회원가입</button>
      </div>
      {token && <Test token={token} />}
    </div>
  );
};

export default LoginForm;
