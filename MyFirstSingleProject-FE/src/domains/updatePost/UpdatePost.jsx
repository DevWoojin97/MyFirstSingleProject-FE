import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './UpdatePost.module.css';
import { getPostById, updatePost } from '@/api/postApi';

export default function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    nickname: '', // 닉네임은 수정 못하게 막는 경우도 많지만 일단 포함
    password: '', // 본인 확인용
  });

  // 1. 기존 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        // 불러온 데이터로 폼 상태 업데이트
        setFormData({
          title: data.title,
          content: data.content,
          nickname: data.nickname,
          password: '', // 비밀번호는 보안상 비워두고 새로 입력받음
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
      await updatePost(id, formData);
      alert('수정이 완료되었습니다.');
      navigate(`/post/${id}`);
    } catch (err) {
      if (err.response?.status === 401) {
        alert('비밀번호가 일치하지 않습니다.');
      } else {
        alert('수정 중 오류가 발생했습니다.');
      }
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
