import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminNoticeBoard.css';
import Pagination from 'react-js-pagination'; // BoardList에서 사용한 페이징 라이브러리 추가

const AdminNoticeBoard = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:8083/api/board/get-notices?page=${currentPage}&size=4`)
      .then(response => {
        setNotices(response.data.contents);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => console.error('Error fetching notices:', error));
  }, [currentPage]);

  const handleWriteClick = () => {
    navigate('/noticeform');
  };

  const handlePostClick = (notice) => {
    navigate(`/noticeDetail/${notice.nid}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="button-container">
        <button onClick={handleWriteClick}>글쓰기</button>
      </div>

      {notices.length === 0 ? (
        <p>공지사항이 없습니다.</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>추천</th>
                <th>조회</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.nid} onClick={() => handlePostClick(notice)}>
                  <td>{notice.nid}</td>
                  <td>{notice.title}</td>
                  <td>{notice.writer}</td>
                  <td>{new Intl.DateTimeFormat('ko-KR').format(new Date(notice.createdat))}</td>
                  <td>{notice.likes}</td>
                  <td>{notice.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        <div className="pagination-container" style={{ textAlign: 'center' }}>
          <button onClick={handlePrevPage}>이전</button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={handleNextPage}>다음</button>
      </div>
    </div>
      )}
    </div>
  );
};

export default AdminNoticeBoard;
