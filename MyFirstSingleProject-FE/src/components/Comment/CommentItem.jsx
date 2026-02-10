import styles from './CommentSection.module.css';

export default function CommentItem({ comment }) {
  return (
    <div className={styles.commentItem}>
      <div className={styles.commentMeta}>
        <span className={styles.commentNickname}>{comment.nickname}</span>
        <span className={styles.commentDate}>
          (
          {new Date(comment.createdAt).toLocaleString('ko-KR', {
            pattern: 'yyyy.MM.dd HH:mm:ss',
          })}
          )
        </span>
        {/* 나중에 여기에 삭제 버튼 [X] 추가 */}
      </div>
      <p className={styles.commentText}>{comment.content}</p>
    </div>
  );
}
