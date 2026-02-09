import { deletePost, getPostById, updatePost } from '@/api/postApi';
import PasswordModal from '@/components/PasswordModal/PasswordModal';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './PostDetail.module.css'; // CSS 모듈 임포트

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (error) {
        console.error('데이터 로드 실패', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleGoToList = () => {
    navigate('/');
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleActualEdit = async (password) => {
    try {
      await updatePost(id, password);
      setIsEditModalOpen(false);
      navigate(`/post/${id}/edit`, { state: { password } });
    } catch (error) {
      toast.error('비밀번호가 일치하지 않습니다. 🙅');
      throw new Error(error.response?.data?.message || '비밀번호가 일치하지 않습니다.');
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleActualDelete = async (password) => {
    try {
      await deletePost(id, password);
      setIsDeleteModalOpen(false);
      toast.success('성공적으로 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || '비밀번호가 일치하지 않습니다.');
    }
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (!post) return <div className={styles.error}>존재하지 않는 게시글입니다.</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>{post.title}</h2>
        <div className={styles.info}>
          <div className={styles.infoLeft}>
            <span className={styles.nickname}>{post.nickname}</span>
            <span className={styles.date}>{new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div className={styles.infoRight}>
            <span>조회 {post.view}</span>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {post.content}
      </div>

      <div className={styles.footer}>
        <div className={styles.btnLeft}>
          <button onClick={handleGoToList} className={styles.btnGray}>목록</button>
        </div>
        <div className={styles.btnRight}>
          <button onClick={handleEditClick} className={styles.btnBlue}>수정</button>
          <button onClick={handleDeleteClick} className={styles.btnGray}>삭제</button>
        </div>
      </div>

      <PasswordModal
        isOpen={isEditModalOpen}
        title="게시글 수정"
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleActualEdit}
      />

      <PasswordModal
        isOpen={isDeleteModalOpen}
        title="게시글 삭제"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleActualDelete}
      />
    </div>
  );
}