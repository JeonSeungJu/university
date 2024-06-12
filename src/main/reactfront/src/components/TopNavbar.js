import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, setLoggedIn } from '../actions/authActions';
import './TopNavbar.css';

const Navbar = () => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // useSelector로 isLoggedIn 가져오기
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // 스크롤 이벤트 핸들러 등록
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // 스크롤이 아래로 내려갈 때 네브바 숨김
      setIsNavbarVisible(scrollPosition <= 0);
    };

    // 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(setLoggedIn()); // localStorage에 토큰이 있다면 로그인 상태로 설정
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
      <div>
        {/* 위쪽 네브바 */}
        <nav className="navbar navbar-expand-lg navbar-light">
        <div className="top-navbar" id="navbarNav">
              <ul className="navbar-nav">
                {/* 로그인 상태에 따라 로그인 또는 로그아웃 표시 */}
              <li className="nav-item">
                <span onClick={() => handleNavigation('/consultation')} className="nav-link font-weight-bold text-light" style={{ cursor: 'pointer' }}>상담신청</span>
              </li>
              <li className="nav-item">
                <span onClick={() => handleNavigation('/remote-support')} className="nav-link font-weight-bold text-light" style={{ cursor: 'pointer' }}>원격지원</span>
              </li>
              <li className="nav-item">
                <span onClick={() => handleNavigation('/info')} className="nav-link font-weight-bold text-light" style={{ cursor: 'pointer' }}>실습정보</span>
              </li>
              <li className="nav-item">
                <span onClick={() => handleNavigation('/notice')} className="nav-link font-weight-bold text-light" style={{ cursor: 'pointer' }}>공지사항</span>
              </li>
              <li className="nav-item">
                <span onClick={() => handleNavigation('/signup')} className="nav-link font-weight-bold text-light" style={{ cursor: 'pointer' }}>회원가입</span>
              </li>
            <li className="nav-item">
              {/* eslint-disable-next-line no-undef */}
              {isLoggedIn ? (
                <span onClick={handleLogout} className="nav-link font-weight-bold text-light" style={{ cursor: 'pointer' }}>로그아웃</span>
              ) : (
                <span onClick={() => handleNavigation('/login')} className="nav-link font-weight-bold text-light" style={{ cursor: 'pointer' }}>로그인</span>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
