import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BottomNavbar.css';

const BottomNavbar = () => {
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      // 현재 스크롤 위치가 특정 값 이상이면 네브바를 고정
      setIsNavbarFixed(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className="bottom-navbar">
      <span onClick={() => navigate('/social-worker')} className="nav-link">사회복지사</span>
      <span onClick={() => navigate('/childcare-teacher')} className="nav-link">보육교사</span>
      <span onClick={() => navigate('/business')} className="nav-link">경영학</span>
      <span onClick={() => navigate('/nursing-admission')} className="nav-link">간호대학 입학</span>
      <span onClick={() => navigate('/industrial-certificate')} className="nav-link">산업기사/기사</span>
      <span onClick={() => navigate('/beginner-career-portfolio')} className="nav-link">초급 경력수첩</span>
      <span onClick={() => navigate('/transfer')} className="nav-link">편입</span>
      <span onClick={() => navigate('/community')} className="nav-link">커뮤니티</span>
    </nav>
  );
};

export default BottomNavbar;
