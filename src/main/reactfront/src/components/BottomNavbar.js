import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BottomNavbar.css';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const [prevScrollY, setPrevScrollY] = useState(0);


  useEffect(() => {


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
      <span onClick={() => navigate('/community')} className="nav-link">커뮤니티</span>
    </nav>
  );
};

export default BottomNavbar;
