import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePost.module.css';
import { createPost } from '@/api/postApi';

export default function CreatePost() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    nickname: '',
    password: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      alert('제목과 내용을 입력해주세요!');
      return;
    }
    try {
      await createPost(formData);
      alert('게시글이 등록되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('등록 실패:', error);
      alert('서버 오류로 등록에 실패했습니다.');
    }
  };
  const handleGoToList = () => {
    navigate('/');
  };
  return (
    <div className={styles.container}>
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="nickname"
            placeholder="작성자 닉네임"
            value={formData.nickname}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="password"
            placeholder="비밀번호를 입력하세요."
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="title"
            placeholder="제목을 입력하세요"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="content"
            placeholder="내용을 입력하세요."
            value={formData.content}
            onChange={handleChange}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleGoToList}
            className={styles.btnCancel}
          >
            취소
          </button>
          <button type="submit" className={styles.btnSubmit}>
            등록
          </button>
        </div>
      </form>
    </div>
  );
}
