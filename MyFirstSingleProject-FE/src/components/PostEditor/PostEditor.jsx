import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // 에디터 테마 스타일
import { uploadImage } from '../../api/postApi'; // 아까 만든 API 함수

const PostEditor = ({ content, setContent }) => {
  const quillRef = useRef(null);

  // 이미지를 서버로 업로드하는 핸들러
  const imageHandler = () => {
    // 1. 파일을 선택할 input 태그를 동적으로 생성
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    // 2. 파일이 선택되면 실행
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        // 3. 우리가 만든 API로 이미지 업로드
        const res = await uploadImage(file);
        const imageUrl = res.url; // 백엔드에서 준 URL

        // 4. 에디터의 현재 커서 위치에 이미지 삽입
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range.index, 'image', imageUrl);

        // 5. 커서를 이미지 다음으로 이동
        editor.setSelection(range.index + 1);
      } catch (error) {
        console.error('에디터 이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    };
  };

  // 에디터 모듈 설정 (툴바 구성 및 핸들러 연결)
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['image', 'link'], // 이미지 버튼
          ['clean'],
        ],
        handlers: {
          image: imageHandler, // 이미지 버튼 클릭 시 위에서 만든 함수 실행
        },
      },
    }),
    [],
  );

  return (
    <div style={{ background: 'white' }}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={setContent} // 내용이 바뀔 때 부모 컴포넌트의 state 업데이트
        modules={modules}
        placeholder="내용을 입력하세요..."
        style={{ height: '400px', marginBottom: '50px' }}
      />
    </div>
  );
};

export default PostEditor;
