import { useState } from 'react';
import styles from './CommentSection.module.css';
import PasswordModal from '../PasswordModal/PasswordModal';
import { toast } from 'react-toastify';

export default function CommentSection({
  comments,
  onCommentSubmit,
  onCommentDelete,
  currentUser,
}) {
  const [commentInput, setCommentInput] = useState({
    nickname: '',
    password: '',
    content: '',
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [isDeletingMyComment, setIsDeletingMyComment] = useState(false);
  //로그인 여부 확인 (!!를 이용하여 true of false인지만 비교)
  const isLoggedIn = !!currentUser?.id;

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      content: commentInput.content,
      nickname: isLoggedIn ? currentUser.nickname : commentInput.nickname,
      password: isLoggedIn ? '' : commentInput.password,
    };

    onCommentSubmit(submitData, () => {
      setCommentInput({ nickname: '', password: '', content: '' }); // 성공 시 초기화 콜백
    });
  };

  const handleDeleteClick = (commentId, authorId) => {
    // 1. 내 ID 찾기 (userId와 id 둘 다 대응하도록 안전하게 처리)
    const myId = currentUser?.userId || currentUser?.id;

    console.log('--- 삭제 버튼 클릭 분석 ---');
    console.log('1. 내 계정 ID (myId):', myId, typeof myId);
    console.log('2. 댓글 작성자 ID (authorId):', authorId, typeof authorId);
    console.log('3. 로그인 여부 (isLoggedIn):', isLoggedIn);

    // 2. 비교 로직 (String으로 변환하여 타입 불일치 방지)
    // authorId가 존재하고, 내 ID와 일치할 때만 true
    const isMyComment =
      isLoggedIn &&
      authorId !== null &&
      authorId !== undefined &&
      String(myId) === String(authorId);

    console.log('4. 최종 비교 결과 (isMyComment):', isMyComment);
    console.log('---------------------------');

    // 3. 익명 여부 판별 (authorId가 아예 없는 경우)
    const isAnonymous = authorId === null || authorId === undefined;

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
            const myId = currentUser?.userId || currentUser?.id;
            const isMyComment =
              isLoggedIn &&
              comment.authorId &&
              String(myId) === String(comment.authorId);
            const isAnonymous = !comment.authorId;
            return (
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
