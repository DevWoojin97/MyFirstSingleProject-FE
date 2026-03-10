import styles from './UpdatePost.module.css';
import PostEditor from '@/components/PostEditor/PostEditor';
import { useUpdatePost } from '@/hooks/useUpdatePost';

export default function UpdatePost() {
  const {
    formData,
    handleChange,
    handleContentChange,
    handleSubmit,
    navigate,
  } = useUpdatePost();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>게시글 수정</h2>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 닉네임 섹션 */}
        <div className={styles.infoInputRow}>
          <div className={styles.readOnlyBox}>
            <span className={styles.label}>작성자</span>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              readOnly
              className={styles.smallInputReadOnly}
            />
          </div>
        </div>

        {/* 제목 섹션 */}
        <div className={styles.titleRow}>
          <input
            type="text"
            name="title"
            placeholder="제목을 입력하세요"
            maxLength={50}
            value={formData.title}
            onChange={handleChange}
            className={styles.titleInput}
          />
        </div>

        {/* 에디터 섹션 */}
        <div className={styles.contentRow} style={{ minHeight: '450px' }}>
          <PostEditor
            content={formData.content}
            setContent={handleContentChange}
          />
        </div>

        {/* 하단 버튼 */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.btnCancel}
          >
            취소
          </button>
          <button type="submit" className={styles.btnSubmit}>
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
}
