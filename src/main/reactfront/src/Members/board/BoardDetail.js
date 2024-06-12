import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './BoardDetail.css';

const BoardDetail = () => {
  const { id } = useParams(); // 게시글 아이디를 가져옴

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://3.106.45.125:8080/api/board/get-comments/${id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Error fetching comments. Server response:', response);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
};
useEffect(() => {
  // id 값이 null이면 렌더링을 하지 않음
  if (!id) {
    return;
  }

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(`http://3.106.45.125:8080/api/board/get-post-details/${id}`);
      if (response.ok) {
        const data = await response.json();
        // 서버 응답에서 필요한 필드를 가져오도록 수정
        const { title, content, writer, createdAt, imagePath } = data;

        // 이미지 필드가 없을 경우 빈 문자열로 설정

        setPost({
          title,
          content,
          writer,
          createdAt,
          imagePath,
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
  fetchComments();
}, [id]);

  return (
    <div className="board-detail-container">
      {post ? (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <div className="post-info">
            <p>작성자: {post.writer}</p>
            <p>작성일: {new Date(post.createdAt).toLocaleString()}</p>
          </div>
          {post.imagePath && <img src={post.imagePath} alt="게시물 이미지" />}
          <div className="comments-container">
            <h3>댓글</h3>
          </div>
          {comments.map((comment, index) => (
            <React.Fragment key={comment.id}>
              <div className="comment-header">
                <p className="comment-writer">{comment.writer}</p>
                <p className="comment-date">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
              <p className="comment-content">{comment.content}</p>
              {index !== comments.length - 1 && <hr className="comment-divider" />}
            </React.Fragment>
          ))}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BoardDetail;