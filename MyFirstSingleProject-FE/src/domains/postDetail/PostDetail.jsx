import {
  deletePost,
  getPostById,
  updatePost,
  createComment,
  checkPostPassword,
} from '@/api/postApi';
import PasswordModal from '@/components/PasswordModal/PasswordModal';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './PostDetail.module.css';
import CommentSection from '@/components/Comment/CommentSection';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const data = await getPostById(id);
      setPost(data);
    } catch (error) {
      console.error('데이터 로드 실패', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  // 핸들러들
  const handleGoToList = () => navigate('/');
  const handleEditClick = () => setIsEditModalOpen(true);
  const handleDeleteClick = () => setIsDeleteModalOpen(true);

  const handleActualEdit = async (password) => {
    try {
      await checkPostPassword(id, password);
      setIsEditModalOpen(false);
      navigate(`/post/${id}/edit`, { state: { password } });
    } catch (error) {
      // 서버에서 보낸 메시지가 있으면 그걸 쓰고, 없으면 기본 메시지 출력
      const errorMsg =
        error.response?.data?.message ||
        '비밀번호가 일치하지 않거나 오류가 발생했습니다. 🙅';
      toast.error(errorMsg);
      console.error('Edit Auth Error:', error);
    }
  };

  const handleActualDelete = async (password) => {
    try {
      await deletePost(id, password);
      setIsDeleteModalOpen(false);
      toast.success('성공적으로 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || '삭제 중 오류가 발생했습니다.';
      toast.error(errorMsg);
      console.error('Delete Error:', error);
    }
  };

  // 댓글 등록 로직만 부모에서 관리 (데이터 갱신을 위해)
  const handleCommentSubmit = async (commentData, successCallback) => {
    try {
      await createComment(id, commentData);
      toast.success('댓글이 등록되었습니다. 💬');
      successCallback(); // 입력창 비우기
      fetchPost(); // 목록 새로고침
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || '댓글 등록에 실패했습니다.';
      toast.error(errorMsg);
      console.error('Comment Post Error:', error);
    }
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (!post)
    return <div className={styles.error}>존재하지 않는 게시글입니다.</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>{post.title}</h2>
        <div className={styles.info}>
          <div className={styles.infoLeft}>
            <span className={styles.nickname}>{post.nickname}</span>
            <span className={styles.date}>
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
          <div className={styles.infoRight}>
            <span>조회 {post.view}</span>
          </div>
        </div>
      </header>

      <div className={styles.content}>{post.content}</div>

      {/* 분리한 댓글 섹션 */}
      <CommentSection
        comments={post.comments}
        onCommentSubmit={handleCommentSubmit}
      />

      <div className={styles.footer}>
        <div className={styles.btnLeft}>
          <button onClick={handleGoToList} className={styles.btnGray}>
            목록
          </button>
        </div>
        <div className={styles.btnRight}>
          <button onClick={handleEditClick} className={styles.btnBlue}>
            수정
          </button>
          <button onClick={handleDeleteClick} className={styles.btnGray}>
            삭제
          </button>
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
