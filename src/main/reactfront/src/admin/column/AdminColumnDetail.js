import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AdminColumnDetail = () => {
  const { id } = useParams();
  const [column, setColumn] = useState(null);

  useEffect(() => {
    const fetchColumn = async () => {
      try {
        const response = await axios.get(`http://13.237.172.212:8080/api/board/get-column-detail/${id}`);
        setColumn(response.data);
      } catch (error) {
        console.error('Error fetching column:', error);
      }
    };

    fetchColumn();
  }, [id]);

  if (!column) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{column.title}</h1>
      <p>Category: {column.category}</p>
      <p>Author: {column.author}</p>
      <p>Created At: {new Date(column.createdAt).toLocaleDateString()}</p>
      {column.imagePath && <img src={column.imagePath} alt="Column" />}
      <div dangerouslySetInnerHTML={{ __html: column.content }} />
      
      {/* 리스트로 돌아가는 버튼 */}
      <Link to="/column">돌아가기</Link>
    </div>
  );
};

export default AdminColumnDetail;
