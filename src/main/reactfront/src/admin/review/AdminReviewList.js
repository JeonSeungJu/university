
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import './AdminReviewList.css';

const AdminReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState(null); // Track the id of the review to be deleted
  const [showDeletePopup, setShowDeletePopup] = useState(false); // Control the visibility of the delete confirmation popup
  const navigate = useNavigate(); // Use navigate hook

  useEffect(() => {
    // Fetch data from the server
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://3.106.45.125:8080/api/board/get-review?page=${activePage}&size=${itemsPerPage}&search=${searchQuery}`);
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
  }, [activePage, searchQuery]); // Fetch data when activePage or searchQuery changes

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

  const handleSearch = () => {
    // Fetch data with the updated searchQuery
    setActivePage(1); // Reset activePage to 1 when performing a new search
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://3.106.45.125:8080/api/board/delete-review/${id}`);
      setReviews(reviews.filter(review => review.cid !== id));
      setDeleteId(null); // Reset deleteId state after successful deletion
      setShowDeletePopup(false); // Close the delete confirmation popup
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm('정말로 삭제하시겠습니까?');
    if (confirmed) {
      handleDelete(id);
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null); // Reset deleteId state
    setShowDeletePopup(false); // Close the delete confirmation popup
  };

  return (
    <div className="app">
      <div className="search-container">
        <input 
          type="text" 
          placeholder="검색어를 입력하세요" 
          value={searchQuery} 
          onChange={handleSearchChange}
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      <div className="card-container">
        {reviews.map((review, index) => (
          <Card key={index} review={review} onDelete={handleDeleteClick} />
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

      <button onClick={() => navigate('/reviewForm')}>리뷰 작성하기</button>

      {showDeletePopup && (
        <div className="delete-popup">
          <p>정말로 삭제하시겠습니까?</p>
          <button onClick={() => handleDelete(deleteId)}>삭제</button>
          <button onClick={handleCancelDelete}>취소</button>
        </div>
      )}
    </div>
  );
};

function Card({ review, onDelete }) {
  const navigate = useNavigate(); // Add useNavigate hook here

  const handleImageError = (e) => {
    e.target.src = '/path/to/default-image.jpg'; // Default image path
    e.target.alt = '이미지를 로드할 수 없습니다.';
  };
  const handleCardClick = () => {
    navigate(`/reviewdetail/${review.cid}`, { state: { editPath: `/reviewEdit/${review.cid}` } });
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
      <p className="author">{review.mentorContent} / {new Intl.DateTimeFormat('ko-KR').format(new Date(review.createdat))}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/reviewEdit/${review.cid}`);
        }}
        style={{ marginLeft: '10px' }}
      >
        수정
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(review.cid);
        }} 
        style={{ marginLeft: '10px' }}
      >
        삭제
      </button>
    </div>
  );
}

export default AdminReviewList;
