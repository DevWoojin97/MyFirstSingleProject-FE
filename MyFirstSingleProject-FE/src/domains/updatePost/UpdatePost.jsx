import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './UpdatePost.module.css';

export default function UpdatePost({ posts, setPosts }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    const post = posts.find((p) => p.id === Number(id));
    return post
      ? { ...post }
      : { title: '', nickname: '', password: '', content: '' };
  });

  useEffect(() => {
    if (!posts.some((p) => p.id === Number(id))) {
      alert('해당 게시글을 찾을 수 없습니다.');
      navigate('/');
    }
  }, [id, posts, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      alert('제목과 내용을 입력해주세요!');
      return;
    }
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === Number(id) ? { ...post, ...formData } : post,
      ),
    );
    alert('수정이 완료되었습니다.');
    navigate(`/post/${id}`);
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
