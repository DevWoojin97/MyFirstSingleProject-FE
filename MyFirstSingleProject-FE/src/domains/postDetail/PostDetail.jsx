import {
  deletePost,
  getPostById,
  updatePost,
  createComment,
  checkPostPassword,
  deleteComment,
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
  // 현재 로그인한 유저 정보 (Context나 LocalStorage에서 가져옴)
  const currentUser = {
    id: localStorage.getItem('userId'),
    nickname: localStorage.getItem('nickname'),
  };

  const isMyPost =
    post?.userId && Number(post.userId) === Number(currentUser.id);

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

  const handleEditClick = () => {
    const loggedInId = localStorage.getItem('userId'); // 로그인 시 저장한 내 ID
    const postAuthorId = post?.authorId; // DB에서 가져온 글쓴이 ID
    // 둘 다 존재하고 값이 같으면 내 글!
    const isOwner =
      loggedInId && postAuthorId && String(loggedInId) === String(postAuthorId);
    if (isOwner) {
      // ✅ 내 글이면 모달 없이 즉시 이동
      // state에 isMember를 실어 보내면 수정 페이지에서 '비밀번호' 칸을 숨기기 편합니다.
      navigate(`/post/${id}/edit`, { state: { isMember: true } });
    } else if (post?.authorId) {
      // ❌ 남의 회원 글이면
      alert('본인의 글만 수정할 수 있습니다.');
    } else {
      // 👤 익명 글이면 비밀번호 모달 오픈
      setIsEditModalOpen(true);
    }
  };
  const handleDeleteClick = () => {
    const loggedInId = localStorage.getItem('userId'); // 로그인 시 저장한 내 ID
    const postAuthorId = post?.authorId; // DB에서 가져온 글쓴이 ID

    console.log('비교 확인:', { loggedInId, postAuthorId });

    // 둘 다 존재하고 값이 같으면 내 글!
    const isOwner =
      loggedInId && postAuthorId && String(loggedInId) === String(postAuthorId);

    if (isOwner) {
      // 이제 모달 없이 바로 확인창 띄우기 (또는 아까 만든 isMember 모달)
      if (window.confirm('정말 삭제하시겠습니까?')) {
        handleActualDelete();
      }
    } else if (post?.authorId) {
      // 💡 회원 글인데 내가 주인이 아니면 모달을 띄울 필요가 없음!
      alert('본인의 글만 삭제할 수 있습니다.');
    } else {
      // 익명 글이거나 남의 글이면 모달(비밀번호 입력) 띄우기
      setIsDeleteModalOpen(true);
    }
  };

  const handleActualEdit = async (password) => {
    try {
      await checkPostPassword(id, password);
      setIsEditModalOpen(false);
      navigate(`/post/${id}/edit`, { state: { password } });
    } catch (error) {
      // 서버에서 보낸 메시지가 있으면 그걸 쓰고, 없으면 기본 메시지 출력
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        '비밀번호가 일치하지 않거나 오류가 발생했습니다. 🙅';
      toast.error(errorMsg);
      console.error('Edit Auth Error:', error);
    }
  };

  const handleActualDelete = async (password = null) => {
    try {
      await deletePost(id, password);
      setIsDeleteModalOpen(false);
      toast.success('성공적으로 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        '삭제 중 오류가 발생했습니다.';
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
        error.response?.data?.message ||
        error.message ||
        '댓글 등록에 실패했습니다.';
      toast.error(errorMsg);
      console.error('Comment Post Error:', error);
    }
  };

  const handleDeleteComment = async (commentId, password) => {
    try {
      await deleteComment(commentId, password);
      toast.success('댓글이 삭제되었습니다. 🗑️');
      fetchPost(); // 댓글 목록 갱신을 위해 데이터 다시 불러오기
      return true;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        '비밀번호가 일치하지 않습니다.';
      toast.error(errorMsg);
      console.error('Comment Delete Error:', error);
      return false; // 실패 시 false 반환
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

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 분리한 댓글 섹션 */}
      <CommentSection
        comments={post.comments}
        onCommentSubmit={handleCommentSubmit}
        onCommentDelete={handleDeleteComment}
      />

      <div className={styles.footer}>
        <div className={styles.btnLeft}>
          <button onClick={handleGoToList} className={styles.btnGray}>
            목록
          </button>
        </div>
        <div className={styles.btnRight}>
          {/* 본인 글이거나 익명 글일 때만 수정/삭제 버튼 노출 (남의 회원글이면 숨김) */}
          {(isMyPost || !post.userId) && (
            <>
              <button onClick={handleEditClick} className={styles.btnBlue}>
                수정
              </button>
              <button onClick={handleDeleteClick} className={styles.btnGray}>
                삭제
              </button>
            </>
          )}
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
