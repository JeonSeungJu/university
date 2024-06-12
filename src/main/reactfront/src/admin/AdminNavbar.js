// AdminNavbar.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isCommunityOpen, setCommunityOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    console.log('로그아웃 되었습니다.');
    window.location.replace('/');
  };

  const handleCommunityToggle = () => {
    setCommunityOpen(!isCommunityOpen);
  };

  return (
    <nav className="admin-navbar">
      <Link to="/adminComponentMember">Dashboard</Link>
      <div className="dropdown">
        <span onClick={handleCommunityToggle}>커뮤니티</span>
        {isCommunityOpen && (
          <div className="dropdown-content">
            <Link to="/adminBoardList">상담게시판</Link>
            <Link to="/notice">공지사항</Link>
            <Link to="/review">수강생 후기</Link>
            <Link to="/column">컬럼 작성</Link>
          </div>
        )}
      </div>
      
      <button onClick={handleLogout}>로그아웃</button>
    </nav>
  );
};

export default AdminNavbar;
