import React from 'react';
import './BoardDetail.css';

const BoardDetail = ({ post }) => {
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {/* 댓글 목록 및 작성 기능을 추가할 수 있습니다. */}
    </div>
  );
};

export default BoardDetail;