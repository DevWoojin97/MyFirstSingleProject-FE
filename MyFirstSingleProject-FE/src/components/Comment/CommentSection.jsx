import { useState } from 'react';
import styles from './CommentSection.module.css';
import PasswordModal from '../PasswordModal/PasswordModal';

export default function CommentSection({
  comments,
  onCommentSubmit,
  onCommentDelete,
}) {
  const [commentInput, setCommentInput] = useState({
    nickname: '',
    password: '',
    content: '',
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCommentSubmit(commentInput, () => {
      setCommentInput({ nickname: '', password: '', content: '' }); // 성공 시 초기화 콜백
    });
  };

  const handleDeleteClick = (commentId) => {
    setSelectedCommentId(commentId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (password) => {
    const success = await onCommentDelete(selectedCommentId, password);
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <section className={styles.commentSection}>
      <h3 className={styles.commentTitle}>댓글 {comments?.length || 0}</h3>

      {/* 댓글 목록 */}
      <div className={styles.commentList}>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentMeta}>
                <div className={styles.metaLeft}>
                  <span className={styles.commentNickname}>
                    {comment.nickname}
                  </span>
                  <span className={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>

                <button
                  className={styles.commentDeleteBtn}
                  onClick={() => handleDeleteClick(comment.id)}
                >
                  삭제
                </button>
              </div>
              <p className={styles.commentText}>{comment.content}</p>
            </div>
          ))
        ) : (
          <p className={styles.noComments}>등록된 댓글이 없습니다.</p>
        )}
      </div>

      {/* 댓글 작성 폼 */}
      <form className={styles.commentForm} onSubmit={handleSubmit}>
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
        <div className={styles.commentFormBottom}>
          <textarea
            placeholder="내용을 입력하세요"
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
        title="댓글 삭제"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
