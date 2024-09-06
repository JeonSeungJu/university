

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './AdminNoticeDetail.css';

const AdminNoticeDetail = () => {
  const { id } = useParams(); 

  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchPostDetail = async () => {
      try {
        const response = await fetch(`http://13.237.172.212:8080/api/board/get-notice-details/${id}`);
        if (response.ok) {
          const data = await response.json();
          const { title, content, writer, createdAt } = data;

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

    fetchPostDetail();
  }, [id]);

  const renderContent = () => {
    if (!notice) {
      return <p>Loading...</p>;
    }

    // content에 이미지가 포함되어 있는지 확인
    const hasImage = notice.content.includes('<img');

    return (
      <div className="post-detail">
        <h2>{notice.title}</h2>
        {/* 이미지가 있는 경우 HTML로 렌더링 */}
        {hasImage ? (
          <div dangerouslySetInnerHTML={{ __html: notice.content }} />
        ) : (
          <p>{notice.content}</p>
        )}
        <div className="post-info">
          <p>작성자: {notice.writer}</p>
          <p>작성일: {new Date(notice.createdAt).toLocaleString()}</p>
          <Link to={`/noticeEdit/${id}`}>수정</Link>
        </div>
      </div>
    );
  };

  return <div className="board-detail-container">{renderContent()}</div>;
};

export default AdminNoticeDetail;

