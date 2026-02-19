import { getPosts } from '@/api/postApi';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import Pagination from '@/components/Pagination/Pagination';

const DEBOUNCE_DELAY = 500; // 사용자가 입력을 멈추고 0.5초 뒤에 실행
const LIMIT = 10; // 한 페이지에 보여줄 게시글 수

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // 입력 필드 및 검색어 상태
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // 1. 디바운스 타이머 설정: API 호출 횟수를 줄여 서버 부하 방지
    const debounceTimer = setTimeout(() => {
      const fetchPosts = async () => {
        try {
          const result = await getPosts({
            search: searchTerm,
            page: currentPage,
            limit: LIMIT,
          });

          // 백엔드 응답 구조에 맞춰 데이터 세팅
          const newPosts = result.posts || [];
          setPosts(newPosts);

          // 페이지네이션을 위한 메타 정보 세팅
          setTotalCount(result.totalCount || 0);
          setTotalPages(result.totalPages || 1);
        } catch (error) {
          console.error('데이터 로딩 실패:', error);
        }
      };

      fetchPosts();
    }, DEBOUNCE_DELAY);

    // 2. 타이머 클린업: 다음 입력이 들어오면 이전 타이머를 취소함
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, currentPage]); // 검색어 혹은 페이지 번호 변경 시 실행

  // 검색어 입력 시 페이지를 1페이지로 리셋하는 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>우진이의 커뮤니티 게시판</h1>
      </header>

      {/* 게시글 테이블 영역 */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.num}>번호</th>
            <th className={styles.title}>제목</th>
            <th className={styles.writer}>글쓴이</th>
            <th className={styles.date}>작성일</th>
            <th className={styles.view}>조회</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr
                key={post.id}
                className={styles.tr}
                onClick={() => navigate(`/post/${post.id}`)} // 3. 행 전체 클릭 시 이동
                style={{ cursor: 'pointer' }} // 마우스 올리면 손가락 모양
              >
                <td className={styles.num}>{post.id}</td>
                <td className={styles.titleText}>
                  {/* Link 대신 텍스트만 둬도 되고, 그대로 둬도 무방합니다 */}
                  {post.title}
                  {/* 댓글이 있을 때만 괄호와 함께 개수 표시 */}
                  {post.commentCount > 0 && (
                    <span className={styles.commentCount}>
                      [{post.commentCount}]
                    </span>
                  )}
                </td>
                <td className={styles.writer}>{post.nickname}</td>
                <td className={styles.date}>
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </td>
                <td className={styles.view}>{post.view}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className={styles.noData}>
                검색 결과나 게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 글쓰기 버튼 영역 */}
      <div className={styles.buttonWrapper}>
        <Link to={'/post/new'}>
          <button className={styles.writeBtn}>글쓰기</button>
        </Link>
      </div>

      {/* 페이지네이션 컴포넌트 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      {/* 검색 바 영역 */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default Home;
