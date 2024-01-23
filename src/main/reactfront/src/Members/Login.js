import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux'; // useDispatch 추가
import { login } from '../actions/authActions'; // login 액션 import
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8083/api/members/login', {
        email,
        password,
      });

      const token = response.data;

      localStorage.setItem('token', token);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('로그인 액션 디스패치 전');
      dispatch(login());
      console.log('로그인 액션 디스패치 후');
      // console.log('변경된 Redux 상태:', store.getState()); // 이 부분은 필요 없어집니다.

      navigate('/');
      // setIsLoggedIn(true); // 이 부분은 필요 없어집니다.
    } catch (error) {
      console.error('로그인 실패', error);
      alert('로그인에 실패했습니다.');
    }
  };

  const handleForgotPassword = () => {
    console.log('비밀번호 찾기 클릭');
  };

  const handleSignUp = () => {
    console.log('회원가입 클릭');
  };

  useEffect(() => {
    console.log('isLoggedIn 상태:', rememberMe);
  }, [rememberMe]);

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <br />
        <label>Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <br />
        <label>
          <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} />
          자동로그인
        </label>
        <br />
        <button type="submit">로그인</button>
      </form>
      <div className="login-buttons">
        <button onClick={handleForgotPassword}>비밀번호 찾기</button>
        <button onClick={handleSignUp}>회원가입</button>
      </div>
    </div>
  );
};

export default LoginForm;