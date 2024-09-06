import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './NoticeDetail.css';

const NoticeDetail = () => {
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

          // 조회수 증가 처리
          increaseViews(id);
        } else {
          console.error('Error fetching post details. Server response:', response);
        }
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostDetail();
  }, [id]);

  const increaseViews = async (id) => {
    console.log('Increase views function called'); // 콘솔 로그 추가
  
    const viewsKey = `views_${id}`;
    const storedViews = localStorage.getItem(viewsKey);
  
    // 오늘 날짜 00:00의 타임스탬프
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    console.log(id, storedViews); // 콘솔 로그 추가
  
    // 이전에 저장된 조회수가 없거나 오늘의 날짜 00:00 이후에 조회했을 때 조회수 증가
    if (!storedViews || Number(storedViews) < todayMidnight.getTime()) {
      try {
        // 조회수 증가 API 호출
        const response = await fetch(`http://13.237.172.212:8080/api/board/increase-views/${id}`, {
          method: 'PUT',
        });
        console.log('안녕은 영원한 헤어짐은 아니겠지요',id); // 콘솔 로그 추가
        if (response.ok) {
          // 현재 시간을 기록하여 로컬 스토리지에 저장
          localStorage.setItem(viewsKey, new Date().getTime().toString());
        } else {
          console.error('Error increasing views. Server response:', response);
        }
      } catch (error) {
        console.error('Error increasing views:', error);
      }
    }
  };
  
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

export default NoticeDetail;
