import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BottomNavbar.css';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤 방향이 아래로이고, 스크롤 양이 일정 이상이면 fixed 클래스 추가
      if (currentScrollY > prevScrollY && currentScrollY > 200) {
        setIsNavbarFixed(true);
      } else {
        setIsNavbarFixed(false);
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollY]);

  return (
    <nav className={`bottom-navbar ${isNavbarFixed ? 'fixed' : ''}`}>
      <span onClick={() => navigate('/social-worker')} className="nav-link">사회복지사</span>
      <span onClick={() => navigate('/childcare-teacher')} className="nav-link">보육교사</span>
      <span onClick={() => navigate('/business')} className="nav-link">경영학</span>
      <span onClick={() => navigate('/nursing-admission')} className="nav-link">간호대학 입학</span>
      <span onClick={() => navigate('/industrial-certificate')} className="nav-link">산업기사/기사</span>
      <span onClick={() => navigate('/beginner-career-portfolio')} className="nav-link">초급 경력수첩</span>
      <span onClick={() => navigate('/transfer')} className="nav-link">편입</span>
      <span className="nav-link">
        커뮤니티
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={() => navigate('/column')}>칼럼</div>
          <div className="dropdown-item" onClick={() => navigate('/review')}>리뷰</div>
          <div className="dropdown-item" onClick={() => navigate('/notice')}>공지사항</div>
        </div>
      </span>
    </nav>
  );
};

export default BottomNavbar;
