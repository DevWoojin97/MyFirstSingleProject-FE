import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './UpdatePost.module.css';
import { getPostById, updatePost } from '@/api/postApi';
import { toast } from 'react-toastify';

export default function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 상세 페이지 모달에서 보낸 비밀번호 꺼내기
  const passwordFromState = location.state?.password;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    nickname: '',
  });

  

  useEffect(() => {
    if (!passwordFromState) {
      toast.warn('비밀번호 인증이 필요합니다.');
      navigate(`/post/${id}`);
    }
  }, [passwordFromState, id, navigate]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setFormData({
          title: data.title || '',
          content: data.content || '',
          nickname: data.nickname || '',
        });
      } catch (err) {
        toast.error(
          err.response?.data?.message || '데이터를 불러오지 못했습니다.',
        );
        navigate('/');
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, passwordFromState, formData);
      toast.success('수정이 완료되었습니다. ✨');
      navigate(`/post/${id}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || '수정 중 오류가 발생했습니다.',
      );
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>게시글 수정</h2>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 닉네임 (수정 불가 - 디시 느낌의 회색 톤) */}
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
            value={formData.title}
            onChange={handleChange}
            className={styles.titleInput}
          />
        </div>

        {/* 본문 섹션 (textarea) */}
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
