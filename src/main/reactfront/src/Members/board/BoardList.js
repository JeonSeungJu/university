import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BoardList.css';

const BoardList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableWidth, setTableWidth] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  const [searchOption, setSearchOption] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page')) || 1;
    const option = params.get('option') || 'all';
    const value = params.get('value') || '';

    setCurrentPage(page);
    setSearchOption(option);
    setSearchValue(value);

    fetchPosts(page, option, value);
  }, [location.search]);

  const fetchPosts = async (page, option, value) => {
    setLoading(true);
    try {
      const response = await fetch(`http://13.237.172.212:8080/api/board/search-posts?option=${option}&value=${value}&page=${page}&size=4`);
      const data = await response.json();
      setPosts(data.contents || []);
      setTotalPages(data.totalPages || 1);
      setTotalItemsCount(data.totalItems || 0);
      setLoading(false);
    } catch (error) {
      setError('게시글을 불러오는 중에 오류가 발생했습니다.');
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const table = document.getElementById('post-table');
    if (table) {
      setTableWidth(table.offsetWidth);
    }
  }, [posts]);

  const handleWriteClick = () => {
    navigate('/boardForm');
  };

  const handleSearch = () => {
    navigate(`?option=${searchOption}&value=${searchValue}&page=1`);
  };

  const handlePostClick = async (post) => {
    if (post.isSecret) {
      try {
        const password = prompt('비밀번호를 입력하세요:');
        if (password !== null) {
          const boardDTO = { id: post.cid, password: password };
          const response = await fetch('http://13.237.172.212:8080/api/board/verify-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(boardDTO),
          });
          const data = await response.json();
          if (response.ok) {
            navigate(`/boardDetail/${post.cid}`);
          } else {
            alert(data.message);
          }
        }
      } catch (error) {
        console.error('Error verifying password:', error);
      }
    } else {
      navigate(`/boardDetail/${post.cid}`);
    }
  };

  const handlePageChange = (page) => {
    navigate(`?option=${searchOption}&value=${searchValue}&page=${page}`);
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
        <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
          <option value="all">전체</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="writer">작성자</option>
        </select>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : posts.length === 0 ? (
        <p className="no-posts">게시글이 없습니다.</p>
      ) : (
        <div>
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
                <tr key={post.cid}>
                  <td>{post.cid}</td>
                  <td onClick={() => handlePostClick(post)}>
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
          <div className="pagination-container" style={{ textAlign: 'center' }}>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>이전</button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>다음</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardList;


