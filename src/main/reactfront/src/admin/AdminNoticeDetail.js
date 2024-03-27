import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './AdminNoticeDetail.css';

const AdminNoticeDetail = () => {
  const { id } = useParams(); // 게시글 아이디를 가져옴

  const [notice, setNotice] = useState(null);

useEffect(() => {
  // id 값이 null이면 렌더링을 하지 않음
  if (!id) {
    return;
  }

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(`http://localhost:8083/api/board/get-notice-details/${id}`);
      if (response.ok) {
        const data = await response.json();
        // 서버 응답에서 필요한 필드를 가져오도록 수정
        const { title, content, writer, createdAt } = data;

        // 이미지 필드가 없을 경우 빈 문자열로 설정

        setNotice({
          title,
          content,
          writer,
          createdAt,
        });
      } else {
        console.error('Error fetching post details. Server response:', response);
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  // 게시글 아이디가 존재하면 상세 내용과 댓글을 가져옴
  fetchPostDetail();
}, [id]);

  return (
    <div className="board-detail-container">
      {notice ? (
        <>
          <h2>{notice.title}</h2>
          <p>{notice.content}</p>
          <div className="post-info">
            <p>작성자: {notice.writer}</p>
            <p>작성일:{new Date(notice.createdAt).toLocaleString()}</p>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminNoticeDetail;
