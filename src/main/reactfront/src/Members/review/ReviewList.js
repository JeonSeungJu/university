

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import './ReviewList.css';


const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all'); // 추가: 검색 타입 상태
  const [deleteId, setDeleteId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://13.237.172.212:8080/api/board/get-review?page=${activePage}&size=${itemsPerPage}&search=${searchQuery}&searchType=${searchType}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data.contents);
        setTotalItemsCount(data.totalItems);
        setTotalPages(Math.ceil(data.totalItems / itemsPerPage));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchReviews();
  }, [activePage, searchQuery, searchType]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handlePrevPage = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
    }
  };

  const handleNextPage = () => {
    if (activePage < totalPages) {
      setActivePage(activePage + 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearch = () => {
    setActivePage(1);
  };



  return (
    <div className="app">
      <div className="search-container" style={{ display: 'flex', alignItems: 'center' }}>
        <select value={searchType} onChange={handleSearchTypeChange}>
          <option value="all">전체</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>
        <input 
          type="text" 
          placeholder="검색어를 입력하세요" 
          value={searchQuery} 
          onChange={handleSearchChange}
          style={{ marginLeft: '10px' }}
        />
        <button onClick={handleSearch} style={{ marginLeft: '10px' }}>검색</button>
      </div>

      <div className="card-container">
        {reviews.map((review, index) => (
          <Card key={index} review={review}  />
        ))}
      </div>

      <div className="pagination-container" style={{ textAlign: 'center' }}>
        <button onClick={handlePrevPage} disabled={activePage === 1}>이전</button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={activePage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={activePage === totalPages}>다음</button>
      </div>

    
    </div>
  );
};

function Card({ review, onDelete }) {
  const navigate = useNavigate();

  const handleImageError = (e) => {
    e.target.src = '/path/to/default-image.jpg';
    e.target.alt = '이미지를 로드할 수 없습니다.';
  };

  // 날짜가 유효하지 않은 경우를 위해 예외 처리 추가
  const formattedDate = review.createdat ? new Intl.DateTimeFormat('ko-KR').format(new Date(review.createdat)) : '날짜 없음';

  const handleCardClick = () => {
    navigate(`/reviewdetail/${review.rid}`, { state: { editPath: `/reviewEdit/${review.rid}` } });
  };

  return (
    <div className="card" onClick={handleCardClick}>
      {review.ImagePath ? (
        <img src={review.ImagePath} alt="게시물 이미지" style={{ height: '150px' }} onError={handleImageError} />
      ) : (
        <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
          이미지가 없습니다.
        </div>
      )}
      <p className="title">{review.title}</p>
      <p className="author">{review.mentorContent} / {formattedDate}</p>
 
    </div>
  );
}

export default ReviewList;

