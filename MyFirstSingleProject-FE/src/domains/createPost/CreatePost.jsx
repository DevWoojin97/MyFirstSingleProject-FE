import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePost.module.css';
import { createPost } from '@/api/postApi';
import { toast } from 'react-toastify'; // alert 대신 toast 사용

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

    if (
      !formData.title ||
      !formData.content ||
      !formData.nickname ||
      !formData.password
    ) {
      toast.warn('모든 항목을 입력해주세요!');
      return;
    }

    try {
      await createPost(formData);
      toast.success('게시글이 등록되었습니다. ✨');
      navigate('/');
    } catch (error) {
      console.error('등록 실패:', error);
      toast.error('서버 오류로 등록에 실패했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>게시글 작성</h2>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 작성 정보 섹션 (닉네임, 비밀번호) */}
        <div className={styles.infoInputRow}>
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            value={formData.nickname}
            onChange={handleChange}
            className={styles.smallInput}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            className={styles.smallInput}
          />
        </div>

        {/* 제목 섹션 */}
        <div className={styles.titleRow}>
          <input
            type="text"
            name="title"
            placeholder="제목을 입력하세요"
            value={formData.title}
            onChange={handleChange}
            className={styles.titleInput}
          />
        </div>

        {/* 본문 섹션 (textarea로 변경) */}
        <div className={styles.contentRow}>
          <textarea
            name="content"
            placeholder="내용을 입력하세요."
            value={formData.content}
            onChange={handleChange}
            className={styles.contentTextarea}
          />
        </div>

        {/* 버튼 섹션 */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => navigate('/')}
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
