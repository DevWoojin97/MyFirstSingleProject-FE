import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import Pagination from '@/components/Pagination/Pagination';
import VerifiedIcon from '@/components/Icons/VerifiedIcon';
import clsx from 'clsx';
import LoginSidebar from '@/domains/login/LoginSidebar';
import Header from '@/components/Header/Header';
import { FcGoogle } from 'react-icons/fc';
import { useHome } from '@/hooks/useHome'; // 훅 임포트

const Home = () => {
  // 훅에서 모든 로직과 상태를 가져옵니다.
  const {
    posts,
    currentPage,
    totalPages,
    searchTerm,
    isLoading,
    isLongLoading,
    handleSearchChange,
    handlePageChange,
    navigate,
  } = useHome();

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.mainWrapper}>
        <section className={styles.contentSection}>
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
                      <span className={styles.actualTitle}>{post.title}</span>
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
                        <span className={styles.nicknameText}>
                          {post.nickname}
                        </span>
                        {post.authorId && (
                          <>
                            {post.author?.provider === 'GOOGLE' ? (
                              <span
                                className={styles.googleBadgeSmall}
                                title="구글 회원"
                              >
                                <FcGoogle size={12} />
                              </span>
                            ) : (
                              <span
                                className={styles.fixedBadge}
                                title="인증 회원"
                              >
                                <VerifiedIcon />
                              </span>
                            )}
                          </>
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
                <tr>
                  <td colSpan="5" className={styles.noData}>
                    검색 결과나 게시글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className={styles.buttonWrapper}>
            <Link to={'/post/new'}>
              <button className={styles.writeBtn}>글쓰기</button>
            </Link>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </section>

        <aside className={styles.sidebar}>
          <LoginSidebar />
        </aside>
      </div>

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
