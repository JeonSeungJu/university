import React from "react";
import ReactQuill from "react-quill";
import Quill from 'quill';
import ImageResize from '@looop/quill-image-resize-module-react'; 
import AdminColumnForm from "./AdminColumnForm";

// 이미지 리사이즈 모듈을 등록합니다.
Quill.register('modules/imageResize', ImageResize);

function CustomReactQuill({ id, value, setValue, isDisable }) {
  const modules = {
    toolbar: [
      [{ 'font': [] }],
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      [{ 'align': [] }, { 'color': [] }, { 'background': [] }],
      ['clean']
    ],
    // 이미지 리사이즈 모듈 설정
    imageResize: {
      displaySize: true,
      handleStyles: {
        backgroundColor: 'black',
        border: 'none',
        color: 'white',
        position: 'absolute',
        right: '0',
        left: '0',
        padding: '0.5em 0.3em',
        textAlign: 'center',
        bottom: '-1em'
      },
      // 이미지 업로드 핸들러 설정
      handlers: {
        image: imageHandler // 이미지 핸들러를 사용
      }
    }
  };

  const formats = [
    'font',
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'align',
    'color',
    'background'
  ];

  // 이미지 핸들러 함수 정의
  const imageHandler = () => {
    // 이미지를 업로드할 서버의 URL을 지정합니다.
    const serverURL = 'http://example.com/uploadImage';

    // 이미지를 서버로 전송하는 로직을 작성합니다.
    // 예시: fetch나 axios를 사용하여 서버로 이미지 전송하는 코드를 작성합니다.
  };

  return (
    <ReactQuill
      id={id}
      className="form-control text-editor"
      theme="snow"
      modules={modules}
      formats={formats}
      value={value || ''}
      onChange={(content, delta, source, editor) => setValue(editor.getHTML())}
      style={{ width: '100%' }}
      readOnly={isDisable}
    />
  );
}

export default CustomReactQuill;
