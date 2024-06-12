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
  const [searchOption, setSearchOption] = useState('title'); // 검색 옵션 상태 추가
  const [searchValue, setSearchValue] = useState(''); // 검색어 상태 추가

  useEffect(() => {
    axios.get(`http://3.106.45.125:8080/api/board/get-notices?page=${currentPage}&size=4`)
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

  const handleDelete = async (nid) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        const response = await axios.delete(`http://3.106.45.125:8080/api/board/delete-notice/${nid}`);
        if (response.status === 200) {
          setNotices(notices.filter(notice => notice.nid !== nid));
        } else {
          alert('삭제 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('Error deleting notice:', error);
      }
    }
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

  const handleSearch = () => {
    axios.get(`http://3.106.45.125:8080/api/board/search-notices?option=${searchOption}&value=${searchValue}&page=1&size=4`)
      .then(response => {
        setNotices(response.data.contents);
        setTotalPages(response.data.totalPages);
        setCurrentPage(1);
      })
      .catch(error => console.error('Error searching notices:', error));
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
                <td>{notice.views}</td>
                <td>
                  <button onClick={() => handleDelete(notice.nid)}>삭제</button>
                </td>
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
      
      <div className="search-container">
        <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
          <option value="title">제목</option>
          <option value="writer">작성자</option>
          {/* 다른 검색 옵션 추가 */}
        </select>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
    </div>
  );
};

export default AdminNoticeBoard;