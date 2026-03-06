import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePost.module.css';
import { createPost } from '@/api/postApi';
import { toast } from 'react-toastify'; // alert 대신 toast 사용
import PostEditor from '@/components/PostEditor/PostEditor';
import { useAuth } from '@/contexts/AuthContext';

export default function CreatePost() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn, nickname: loggedInNickname } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    nickname: isLoggedIn ? loggedInNickname : '',
    password: '',
    content: '',
  });

  useEffect(() => {
    if (isLoggedIn) {
      setFormData((prev) => ({ ...prev, nickname: loggedInNickname }));
    }
  }, [isLoggedIn, loggedInNickname]);

  // 일반 input 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // 2. 에디터 전용 변경 핸들러 (PostEditor에서 호출됨)
  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비회원일 때만 닉네임/비밀번호 검사
    if (!isLoggedIn) {
      if (!formData.nickname.trim())
        return toast.warn('닉네임을 입력해주세요! 👤');
      if (!formData.password) return toast.warn('비밀번호를 입력해주세요! 🔒');

      const pwLength = formData.password.length;
      if (pwLength < 4 || pwLength > 8) {
        return toast.warn('비밀번호는 4자에서 8자 사이여야 합니다!');
      }
    }

    if (!formData.title.trim()) return toast.warn('제목을 입력해주세요! ✍️');

    const isContentEmpty =
      !formData.content ||
      formData.content.replace(/<(.|\n)*?>/g, '').trim().length === 0;

    if (isContentEmpty) {
      return toast.warn('내용을 입력해주세요! 📝');
    }

    setIsLoading(true);
    try {
      const submitData = isLoggedIn ? { ...formData, password: '' } : formData;

      await createPost(submitData);
      toast.success('게시글이 등록되었습니다. ✨');
      navigate('/');
    } catch (error) {
      console.error('등록 실패:', error);
      const errorMsg =
        error.response?.data?.message || '서버 오류로 등록에 실패했습니다.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

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
