import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './CreatePost.module.css';
import PostEditor from '@/components/PostEditor/PostEditor';
import { useCreatePost } from '@/domains/createPost/useCreatePost';

export default function CreatePost() {
  const navigate = useNavigate();

  const {
    formData,
    isLoading,
    isLoggedIn,
    handleChange,
    handleContentChange,
    create,
  } = useCreatePost();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      if (!formData.nickname.trim()) {
        return toast.warn('닉네임을 입력해주세요! 👤');
      }

      if (!formData.password) {
        return toast.warn('비밀번호를 입력해주세요! 🔒');
      }

      if (formData.password.length < 4 || formData.password.length > 8) {
        return toast.warn('비밀번호는 4자에서 8자 사이여야 합니다!');
      }
    }

    if (!formData.title.trim()) {
      return toast.warn('제목을 입력해주세요! ✍️');
    }

    const isContentEmpty =
      !formData.content ||
      formData.content.replace(/<(.|\n)*?>/g, '').trim().length === 0;

    if (isContentEmpty) {
      return toast.warn('내용을 입력해주세요! 📝');
    }

    try {
      await create();

      toast.success('게시글이 등록되었습니다. ✨');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || '등록 실패');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>게시글 작성</h2>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {!isLoggedIn && (
          <div className={styles.infoInputRow}>
            <input
              type="text"
              name="nickname"
              placeholder="닉네임 (최대 8자)"
              maxLength={8}
              value={formData.nickname}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className={styles.smallInput}
            />

            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className={styles.smallInput}
            />
          </div>
        )}

        <div className={styles.titleRow}>
          <input
            type="text"
            name="title"
            placeholder="제목을 입력하세요 (최대 50자)"
            maxLength={50}
            value={formData.title}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            className={styles.titleInput}
          />
        </div>

        <div className={styles.contentRow} style={{ minHeight: '450px' }}>
          <PostEditor
            content={formData.content}
            setContent={handleContentChange}
          />
        </div>

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
