import styles from './CommentSection.module.css';
import PasswordModal from '../PasswordModal/PasswordModal';
import VerifiedIcon from '../Icons/VerifiedIcon';
import clsx from 'clsx';
import { FcGoogle } from 'react-icons/fc';
import { useCommentSection } from './useCommentSection';

export default function CommentSection({
  comments,
  onCommentSubmit,
  onCommentDelete,
}) {
  const {
    isLoggedIn,
    myNickname,
    myId,
    commentInput,
    isDeleteModalOpen,
    isDeletingMyComment,
    handleSubmit,
    handleDeleteClick,
    handleConfirmDelete,
    setIsDeleteModalOpen,
    setInputDirectly,
  } = useCommentSection(onCommentSubmit, onCommentDelete);

  return (
    <section className={styles.commentSection}>
      <h3 className={styles.commentTitle}>댓글 {comments?.length || 0}</h3>

      {/* 댓글 목록 */}
      <div className={styles.commentList}>
        {comments && comments.length > 0 ? (
          comments.map((comment) => {
            const isMyComment =
              isLoggedIn &&
              comment.authorId &&
              String(myId) === String(comment.authorId);
            const isAnonymous = !comment.authorId;
            return (
              <div
                key={comment.id}
                id={`comment-${comment.id}`}
                className={styles.commentItem}
              >
                <div className={styles.commentMeta}>
                  <div className={styles.metaLeft}>
                    <span
                      className={clsx(
                        styles.commentNickname,
                        comment.authorId && styles.isFixed,
                      )}
                    >
                      {comment.nickname}
                      {comment.authorId && (
                        <div className={styles.fixedBadge}>
                          {comment.author?.provider === 'GOOGLE' ? (
                            <FcGoogle />
                          ) : (
                            <VerifiedIcon />
                          )}
                        </div>
                      )}
                    </span>
                    <span className={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {(isMyComment || isAnonymous) && (
                    <button
                      className={styles.commentDeleteBtn}
                      onClick={() =>
                        handleDeleteClick(comment.id, comment.authorId)
                      }
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className={styles.commentText}>{comment.content}</p>
              </div>
            );
          })
        ) : (
          <p className={styles.noComments}>등록된 댓글이 없습니다.</p>
        )}
      </div>

      {/* 댓글 작성 폼 */}
      <form className={styles.commentForm} onSubmit={handleSubmit}>
        {!isLoggedIn && (
          <div className={styles.commentFormTop}>
            <input
              type="text"
              placeholder="닉네임"
              maxLength={8}
              value={commentInput.nickname}
              onChange={(e) => setInputDirectly('nickname', e.target.value)}
              className={styles.commentInput}
            />
            <input
              type="password"
              maxLength={8}
              placeholder="비밀번호"
              value={commentInput.password}
              onChange={(e) => setInputDirectly('password', e.target.value)}
              className={styles.commentInput}
            />
          </div>
        )}

        <div className={styles.commentFormBottom}>
          <textarea
            placeholder={
              isLoggedIn
                ? `${myNickname}님, 댓글을 남겨보세요!`
                : '내용을 입력하세요'
            }
            maxLength={300}
            value={commentInput.content}
            onChange={(e) => setInputDirectly('content', e.target.value)}
            className={styles.commentTextarea}
          />
          <button type="submit" className={styles.commentSubmitBtn}>
            등록
          </button>
        </div>
      </form>

      <PasswordModal
        isOpen={isDeleteModalOpen}
        title={
          isDeletingMyComment ? '댓글을 삭제하시겠습니까?' : '비밀번호 확인'
        }
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isPasswordRequired={!isDeletingMyComment}
      />
    </section>
  );
}
