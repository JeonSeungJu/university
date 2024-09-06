import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AdminNoticeForm.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminNoticeEdit = () => {
  const { id } = useParams(); // URL의 파라미터에서 id 값을 가져옴
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [writer, setWriter] = useState('관리자');
  const [content, setContent] = useState('');
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.getModule('toolbar').addHandler('image', imageHandler);
    }
  }, []);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await axios.get(`http://13.237.172.212:8080/api/board/get-notice-details/${id}`);
        if (response.status === 200) {
          const data = response.data;
          setTitle(data.title);
          setWriter(data.writer);
          setContent(data.content);
        } else {
          console.error('Failed to fetch notice details');
        }
      } catch (error) {
        console.error('Error fetching notice details:', error);
      }
    };

    fetchNotice();
  }, [id]);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://13.237.172.212:8080/api/board/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const imageUrl = response.data;
      return imageUrl;
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error);
      return null;
    }
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', imageUrl);
      }
    };
  };

  const handleSubmit = async () => {
    const noticeData = {
      id,  // ID를 포함해야 합니다.
      title,
      writer,
      content,
    };

    try {
      const response = await axios.put(`http://13.237.172.212:8080/api/board/edit-notice/${id}`, noticeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) { // 상태 코드가 200이면 성공적으로 처리됨
        console.log('Form submitted successfully!');
        navigate(-1);
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <div className="board-form-container">
      <form>
        <label htmlFor="title">제목:</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label htmlFor="writer">작성자 이름:</label>
        <input type="text" id="writer" value={writer} onChange={(e) => setWriter(e.target.value)} />

        <label htmlFor="content">내용:</label>
        <div>
          <ReactQuill
            ref={quillRef}
            style={{ width: '800px', height: '400px' }}
            value={content}
            modules={modules}
            onChange={handleContentChange}
            formats={['image']}
            placeholder="내용을 입력하세요..."
          />
        </div>

        <div className="button-container">
          <button type="button" onClick={handleCancel}>
            돌아가기
          </button>
          <button type="button" onClick={handleSubmit}>
            글쓰기
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNoticeEdit;

