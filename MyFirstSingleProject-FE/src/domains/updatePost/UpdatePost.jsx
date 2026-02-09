import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './UpdatePost.module.css';
import { getPostById, updatePost } from '@/api/postApi';
import { toast } from 'react-toastify';

export default function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 상세 페이지 모달에서 보낸 비밀번호 꺼내기
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
  // 1. 기존 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        // 불러온 데이터로 폼 상태 업데이트
        setFormData({
          title: data.title || '',
          content: data.content || '',
          nickname: data.nickname || '',
        });
      } catch (err) {
        alert('데이터를 불러오지 못했습니다.', err);
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
      toast.success('수정이 완료되었습니다.');
      navigate(`/post/${id}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || '수정 중 오류가 발생했습니다.',
      );
    }
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
            readOnly
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
