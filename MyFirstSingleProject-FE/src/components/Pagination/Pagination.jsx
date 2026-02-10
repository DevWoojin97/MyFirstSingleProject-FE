import styles from './Pagination.module.css';

export default function Pagination({
  currentPage,
  totalPages, // 💡 백엔드에서 계산해준 값을 그대로 받는 게 정확합니다.
  onPageChange,
}) {
  // 페이지가 1개 이하라면 페이지네이션을 보여줄 필요가 없으므로 null 반환
  if (totalPages <= 1) return null;

  // 1부터 totalPages까지의 숫자 배열 생성 (예: [1, 2, 3, 4, 5])
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.paginationContainer}>
      {/* 이전 페이지 버튼 */}
      <button
        className={styles.arrowBtn}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </button>

      {/* 숫자 버튼들 */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          className={`${styles.pageBtn} ${currentPage === num ? styles.active : ''}`}
          onClick={() => onPageChange(num)}
        >
          {currentPage === num ? <strong>{num}</strong> : num}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        className={styles.arrowBtn}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
}
