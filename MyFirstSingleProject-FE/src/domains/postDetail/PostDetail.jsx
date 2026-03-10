import { useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './PostDetail.module.css';
import CommentSection from '@/components/Comment/CommentSection';
import VerifiedIcon from '@/components/Icons/VerifiedIcon';
import PasswordModal from '@/components/PasswordModal/PasswordModal';
import { FcGoogle } from 'react-icons/fc';
import clsx from 'clsx';
import { usePost } from '@/hooks/usePost';
import { useComments } from '@/hooks/useComments';

export default function PostDetail() {
  const { id } = useParams();
  const { hash } = useLocation();

  // 1. 게시글 관련 훅
  const {
    post,
    loading,
    isMyPost,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    fetchPost,
    handleGoToList,
    handleEditClick,
    handleDeleteClick,
    handleActualEdit,
    handleActualDelete,
  } = usePost(id);

  // 2. 댓글 관련 훅 (게시글 갱신 함수를 넘겨줍니다)
  const { handleCommentSubmit, handleDeleteComment } = useComments(
    id,
    fetchPost,
  );

  // 스크롤 로직 (UI 렌더링과 밀접하므로 유지)
  useEffect(() => {
    if (hash && !loading && post) {
      const elementId = hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add(styles.highlight);
          setTimeout(() => element.classList.remove(styles.highlight), 2000);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [hash, loading, post]);

  if (loading)
    return (
      <div className={styles.loadingModern}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    );
  if (!post)
    return <div className={styles.error}>존재하지 않는 게시글입니다.</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>{post.title}</h2>
        <div className={styles.info}>
          <div className={styles.infoLeft}>
            <span
              className={clsx(styles.nickname, post.authorId && styles.isFixed)}
            >
              {post.nickname}
              {post.authorId &&
                (post.author?.provider === 'GOOGLE' ? (
                  <span className={styles.googleBadge} title="구글 회원">
                    <FcGoogle size={13} />
                  </span>
                ) : (
                  <span className={styles.fixedBadge} title="인증 회원">
                    <VerifiedIcon />
                  </span>
                ))}
            </span>
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
          {(isMyPost || !post.authorId) && (
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
        isPasswordRequired={!isMyPost}
        title={isMyPost ? '정말 삭제하시겠습니까?' : '게시글 삭제 비밀번호'}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleActualDelete}
      />
    </div>
  );
}
