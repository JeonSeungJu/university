import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from 'react-js-pagination'; // BoardList에서 사용한 페이징 라이브러리 추가
import './AdminBoardList.css';

const AdminBoardList = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableWidth, setTableWidth] = useState(null);
  const [password, setPassword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8083/api/board/get-post?page=${currentPage}`);
        const data = response.data;
        setPosts(data.contents);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        setError('게시글을 불러오는 중에 오류가 발생했습니다.');
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [currentPage]);

  useEffect(() => {
    // 게시글 테이블의 너비를 얻어옴
    const table = document.getElementById('post-table');
    if (table) {
      setTableWidth(table.offsetWidth);
    }
  }, [posts]); // posts가 변경될 때마다 실행

  const handleWriteClick = () => {
    navigate('/boardForm');
  };

  const handleSearch = (option, value) => {
    console.log(`Searching by ${option}: ${value}`);
  };

  const handlePostClick = async (post) => {
    // 비밀번호가 없는 경우 상세 내역으로 이동
    navigate(`/adminboardDetail/${post.cid}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // 페이지 변경 시 주소 업데이트
    navigate(`/adminBoardList?page=${newPage}`);
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
      <div className="search-container" style={{ width: tableWidth }}>
        <select>
          <option value="all">전체</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="writer">작성자</option>
        </select>
        <input type="text" placeholder="검색어를 입력하세요" />
        <button onClick={() => handleSearch('all', '검색어')}>검색</button>
      </div>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : posts.length === 0 ? (
        <p className="no-posts">게시글이 없습니다.</p>
      ) : (
        <table id="post-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.cid} onClick={() => handlePostClick(post)}>
                <td>{post.cid}</td>
                <td>
                  {post.isSecret && (
                    <span role="img" aria-label="lock">
                      🔒
                    </span>
                  )}
                  {post.title}
                </td>
                <td>{post.writer}</td>
                <td>{new Intl.DateTimeFormat('ko-KR').format(new Date(post.createdat))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
  );
};

export default AdminBoardList;
