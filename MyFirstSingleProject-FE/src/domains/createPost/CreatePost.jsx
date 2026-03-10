import { useNavigate } from 'react-router-dom';
import styles from './CreatePost.module.css';
import PostEditor from '@/components/PostEditor/PostEditor';
import { useCreatePost } from '@/hooks/useCreatePost';

export default function CreatePost() {
  const navigate = useNavigate();
  const {
    formData,
    isLoading,
    isLoggedIn,
    handleChange,
    handleContentChange,
    handleSubmit,
  } = useCreatePost();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>게시글 작성</h2>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/*  비회원일 때만 닉네임/비밀번호 섹션 노출 */}
        {!isLoggedIn && (
          <div className={styles.infoInputRow}>
            <input
              type="text"
              name="nickname"
              placeholder="닉네임 (최대 8자)"
              maxLength={8} // 브라우저 수준에서 차단
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
        )}

        {/* 제목 섹션 */}
        <div className={styles.titleRow}>
          <input
            type="text"
            name="title"
            placeholder="제목을 입력하세요 (최대 50자)"
            maxLength={50} // 브라우저 수준에서 차단
            value={formData.title}
            onChange={handleChange}
            className={styles.titleInput}
          />
        </div>

        {/* 4. textarea 대신 PostEditor 배치 */}
        <div className={styles.contentRow} style={{ minHeight: '450px' }}>
          <PostEditor
            content={formData.content}
            setContent={handleContentChange}
          />
        </div>

        {/* 버튼 섹션 */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className={styles.btnCancel}
            disabled={isLoading}
          >
            취소
          </button>
          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={isLoading}
          >
            {isLoading ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
