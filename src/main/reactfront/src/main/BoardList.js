import React from 'react';
import { Link } from 'react-router-dom';
import './BoardList.css';

const BoardList = ({ posts }) => {
  return (
    <div>
      <h2>게시글 목록</h2>
      <ul>
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id}>
              {/* 게시글의 내용을 보여주는 코드 */}
            </li>
          ))
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </ul>
      <Link to="/BoardForm">
        <button>글쓰기</button>
      </Link>
    </div>
  );
};

export default BoardList;