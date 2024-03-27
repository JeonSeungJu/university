// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import './ReviewList.css';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  useEffect(() => {
    // Fetch data from the server
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:8083/api/board/get-review?page=${activePage}&size=${itemsPerPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data.contents);
        setTotalItemsCount(data.totalItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchReviews();
  }, [activePage]); // Fetch data when activePage changes

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const navigate = useNavigate();



  return (
    <div className="app">
      <div className="card-container">
        {reviews.map((review, index) => (
          <Card key={index} review={review} />
        ))}
      </div>

      <Pagination
        activePage={activePage}
        itemsCountPerPage={itemsPerPage}
        totalItemsCount={totalItemsCount}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      />
    </div>
  );
};

function Card({ review }) {
  return (
    <div className="card">
      <img src={review.imagePath} alt={`Image of ${review.title}`} style={{ height: '150px' }} />
      <p className="title">{review.title}</p>
      <p className="author"> {review.mentorContent} /  {new Intl.DateTimeFormat('ko-KR').format(new Date(review.createdAt))}</p>
      {/* Link to the individual review detail page */}
      <Link to={`/reviewDetail/${review.id}`}>View Details</Link>
    </div>
  );
}

export default ReviewList;
