import { useState } from 'react';
import styles from './CommentSection.module.css';
import PasswordModal from '../PasswordModal/PasswordModal';
import { toast } from 'react-toastify';
import VerifiedIcon from '../Icons/VerifiedIcon';
import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthContext';

export default function CommentSection({
  comments,
  onCommentSubmit,
  onCommentDelete,
}) {
  const { isLoggedIn, nickname: myNickname, userId: myId } = useAuth();

  const [commentInput, setCommentInput] = useState({
    nickname: '',
    password: '',
    content: '',
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [isDeletingMyComment, setIsDeletingMyComment] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      content: commentInput.content,
      nickname: isLoggedIn ? myNickname : commentInput.nickname,
      password: isLoggedIn ? '' : commentInput.password,
    };

    onCommentSubmit(submitData, () => {
      setCommentInput({ nickname: '', password: '', content: '' }); // 성공 시 초기화 콜백
    });
  };

  const handleDeleteClick = (commentId, authorId) => {
    // 2. 비교 로직 (String으로 변환하여 타입 불일치 방지)
    // authorId가 존재하고, 내 ID와 일치할 때만 true
    const isMyComment =
      isLoggedIn && authorId && String(myId) === String(authorId);

    // 3. 익명 여부 판별 (authorId가 아예 없는 경우)
    const isAnonymous = !authorId;

    if (isMyComment || isAnonymous) {
      setSelectedCommentId(commentId);
      setIsDeletingMyComment(isMyComment); // ✅ 여기서 true가 되어야 비번창이 안 뜸
      setIsDeleteModalOpen(true);
    } else {
      toast.warn('본인의 댓글만 삭제할 수 있습니다.');
    }
  };

  const handleConfirmDelete = async (password) => {
    const success = await onCommentDelete(selectedCommentId, password);
    if (success) {
      setIsDeleteModalOpen(false);
      toast.success('댓글이 성공적으로 삭제되었습니다! 🗑️');
    } else {
      toast.error('삭제에 실패했습니다. 비밀번호를 확인해주세요.');
    }
  };

  return (
    <section className={styles.commentSection}>
      <h3 className={styles.commentTitle}>댓글 {comments?.length || 0}</h3>

      {/* 댓글 목록 */}
      <div className={styles.commentList}>
        {comments && comments.length > 0 ? (
          comments?.map((comment) => {
            const isMyComment =
              isLoggedIn &&
              comment.authorId &&
              String(myId) === String(comment.authorId);
            const isAnonymous = !comment.authorId;
            return (
              <div key={comment.id} className={styles.commentItem}>
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
                        <span className={styles.fixedBadge} title="인증된 회원">
                          <VerifiedIcon />
                        </span>
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
              value={commentInput.nickname}
              onChange={(e) =>
                setCommentInput({ ...commentInput, nickname: e.target.value })
              }
              className={styles.commentInput}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={commentInput.password}
              onChange={(e) =>
                setCommentInput({ ...commentInput, password: e.target.value })
              }
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
            value={commentInput.content}
            onChange={(e) =>
              setCommentInput({ ...commentInput, content: e.target.value })
            }
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
          isDeletingMyComment ? '댓글을 삭제하시겠습니가?' : '비밀번호 확인'
        }
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isPasswordRequired={!isDeletingMyComment}
      />
    </section>
  );
}
