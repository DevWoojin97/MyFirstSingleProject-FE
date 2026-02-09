import { getPosts } from '@/api/postApi';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css'; // CSS 모듈 임포트

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>커뮤니티 게시판</h1>
      </header>

      {/* border="1"은 제거하고 CSS로 제어합니다 */}
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
          {posts.map((post) => (
            <tr key={post.id} className={styles.tr}>
              <td className={styles.num}>{post.id}</td>
              <td className={styles.titleText}>
                <Link to={`/post/${post.id}`} className={styles.link}>
                  {post.title}
                </Link>
              </td>
              <td className={styles.writer}>{post.nickname}</td>
              <td className={styles.date}>
                {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                  month: '2-digit',
                  day: '2-digit',
                })}
              </td>
              <td className={styles.view}>{post.view}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.buttonWrapper}>
        <Link to={'/post/new'}>
          <button className={styles.writeBtn}>글쓰기</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
