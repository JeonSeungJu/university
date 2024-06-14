import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ColumnList.css';

const ColumnList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchColumns(page, option, value);
  }, [location.search]);

  const fetchColumns = async (page, option, value) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://3.106.45.125:8080/api/board/columns?page=${page}&size=4`, {
        params: {
          option: option,
          value: value,
        },
      });
      const data = response.data;
      setColumns(data.contents || []);
      setTotalPages(data.totalPages || 1);
      setTotalItemsCount(data.totalItems || 0);
      setLoading(false);
    } catch (error) {
      setError('컬럼을 불러오는 중에 오류가 발생했습니다.');
      console.error('Error fetching columns:', error);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      navigate(`?option=${searchOption}&value=${searchValue}&page=${currentPage - 1}`);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      navigate(`?option=${searchOption}&value=${searchValue}&page=${currentPage + 1}`);
    }
  };

  const handlePageChange = (page) => {
    navigate(`?option=${searchOption}&value=${searchValue}&page=${page}`);
  };

  const handleWriteClick = () => {
    navigate('/columnForm');
  };

  const handleSearch = () => {
    navigate(`?option=${searchOption}&value=${searchValue}&page=1`);
  };

  const handleColumnClick = (id) => {
    navigate(`/columndetail/${id}`);
  };

  return (
    <div className="column-list-container">
      <div className="search-container">
        <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
          <option value="all">전체</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="author">작성자</option>
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
      ) : columns.length === 0 ? (
        <p className="no-columns">컬럼이 없습니다.</p>
      ) : (
        <div>
          <div className="column-list">
            {columns.map((column) => (
              <div key={column.colid} className="column-card" onClick={() => handleColumnClick(column.colid)}>
                <div className="column-card-image">
                  <div className="circle-image">
                    {column.ImagePath && <img src={column.ImagePath} alt="컬럼 이미지" />}
                  </div>
                </div>
                <div className="column-card-content">
                  <h3 className="column-title">{column.title}</h3>
                  <p className="column-category">
                    카테고리 | {column.category}
                  </p>
                  <p className="column-author-date">
                    {column.author} | {new Date(column.createdat).toLocaleDateString()}
                  </p>
                </div>
                </div>
            ))}
          </div>
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

export default ColumnList;