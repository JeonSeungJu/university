import React from 'react';
import './MainPage.css'; // 스타일 파일을 import

const MainPage = () => {
  return (
    <div className="main-container">
      <img src="main.png" alt="Main Image" className="main-image" />
      <div className="overlay">
        <div className="content">
          <button className="main-button">Button 1</button>
          <button className="main-button">Button 2</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
