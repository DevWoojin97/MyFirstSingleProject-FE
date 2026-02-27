import { getPosts } from '@/api/postApi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import Pagination from '@/components/Pagination/Pagination';
import VerifiedIcon from '@/components/Icons/VerifiedIcon';
import clsx from 'clsx';
import LoginSidebar from '@/domains/login/LoginSidebar';
import Header from '@/components/Header/Header';

const DEBOUNCE_DELAY = 500; // 사용자가 입력을 멈추고 0.5초 뒤에 실행
const LIMIT = 15; // 한 페이지에 보여줄 게시글 수

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // 입력 필드 및 검색어 상태
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // 처음엔 로딩 중!
  const [isLongLoading, setIsLongLoading] = useState(false); // 📍 추가: 5초 이상 걸리는지 체크

  useEffect(() => {
    // 1. 디바운스 타이머 설정: API 호출 횟수를 줄여 서버 부하 방지
    const debounceTimer = setTimeout(() => {
      const fetchPosts = async () => {
        setIsLoading(true); // 로딩 시작
        setIsLongLoading(false); // 로딩 시작 시 초기화

        // 📍 추가: 5초가 지나도 로딩 중이면 isLongLoading을 true로!
        const longLoadingTimer = setTimeout(() => {
          setIsLongLoading(true);
        }, 5000);

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
        } finally {
          setIsLoading(false); // 성공이든 실패든 로딩 off
          clearTimeout(longLoadingTimer); // 데이터 오면 타임 해제
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
      <Header />

      <div className={styles.mainWrapper}>
        <section className={styles.contentSection}>
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
              {isLoading ? (
                /* 1. 로딩 중일 때 표시할 UI */
                <tr>
                  <td colSpan="5" className={styles.loadingTd}>
                    <div className={styles.spinnerBox}>
                      <div className={styles.spinner}></div>
                      {isLongLoading ? (
                        <p style={{ color: '#007bff', fontWeight: 'bold' }}>
                          서버가 깨어나는 중입니다. 잠시만 기다려주세요... (최대
                          30초 소요)
                        </p>
                      ) : (
                        <p>게시글을 불러오는 중입니다...</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : posts.length > 0 ? (
                /* 2. 로딩이 끝났고 데이터가 있을 때 */
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className={styles.tr}
                    onClick={() => navigate(`/post/${post.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className={styles.num}>{post.id}</td>
                    <td className={styles.titleText}>
                      <span
                        className={
                          post.hasImage ? styles.cameraIcon : styles.talkIcon
                        }
                      >
                        {post.hasImage ? '📷 ' : '💬 '}
                      </span>
                      {post.title}
                      {post.commentCount > 0 && (
                        <span className={styles.commentCount}>
                          [{post.commentCount}]
                        </span>
                      )}
                    </td>
                    <td className={styles.writer}>
                      <div
                        className={clsx(
                          styles.nicknameContainer,
                          post.authorId && styles.isFixed,
                        )}
                      >
                        {post.nickname}
                        {post.authorId && (
                          <span className={styles.fixedBadge}>
                            <VerifiedIcon />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={styles.date}>
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className={styles.view}>{post.view}</td>
                  </tr>
                ))
              ) : (
                /* 3. 로딩이 끝났는데 데이터가 진짜 없을 때 */
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
        </section>

        {/* 우측 사이드바 영역 추가 */}
        <aside className={styles.sidebar}>
          <LoginSidebar />
        </aside>
      </div>

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
