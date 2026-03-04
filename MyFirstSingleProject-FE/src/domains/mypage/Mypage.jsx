import { getMyActivity, getMyPosts } from '@/api/userApi';
import { useEffect, useState } from 'react';
import styles from './Mypage.module.css';
import { Link } from 'react-router-dom';

export default function Mypage() {
  const [activity, setActivity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMyData = async () => {
      try {
        // 병렬로 두 API를 동시에 호출합니다.
        const [activityData, postsData] = await Promise.all([
          getMyActivity(),
          getMyPosts(),
        ]);
        setActivity(activityData);
        setPosts(postsData);
      } catch (error) {
        console.error('데이터 로드 실패', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyData();
  }, []);

  if (loading)
    return (
      <div className={styles.loadingModern}>
        <div className={styles.dot}></div>
      </div>
    );
  if (!activity)
    return <div className={styles.error}>데이터를 불러올 수 없습니다.</div>;

  const { profile, stats } = activity;

  return (
    <div className={styles.container}>
      <div className={styles.topNav}>
        <Link title="메인페이지로 이동" to="/" className={styles.homeBtn}>
          🏠 메인으로
        </Link>
      </div>
      {/* 디시인사이드 스타일 헤더 */}
      <section className={styles.header}>
        <div className={styles.profileBox}>
          <div className={styles.avatarWrapper}>
            <img
              src={profile.profileImage || '/default-avatar.png'}
              alt="profile"
              className={styles.avatar}
            />
          </div>
          <div className={styles.userText}>
            <h2 className={styles.nickname}>{profile.nickname}님</h2>
            <p className={styles.email}>{profile.email}</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.label}>게시글</span>
            <span className={styles.count}>{stats.postCount}</span>
          </div>
          <div className={styles.statLine}></div>
          <div className={styles.statItem}>
            <span className={styles.label}>댓글</span>
            <span className={styles.count}>{stats.commentCount}</span>
          </div>
        </div>
      </section>

      {/* 탭 네비게이션 */}
      <nav className={styles.tabs}>
        <button className={styles.activeTab}>작성글</button>
        <button>작성댓글</button>
        <button>설정</button>
      </nav>

      {/* 리스트 영역 (다음 단계에서 구현) */}
      <div className={styles.contentList}>
        {posts.length > 0 ? (
          <ul className={styles.postList}>
            {posts.map((post) => (
              <li key={post.id} className={styles.postItem}>
                <div className={styles.postInfo}>
                  <span className={styles.postTitle}>{post.title}</span>
                </div>
                <div className={styles.postMeta}>
                  <span className={styles.date}>{post.createdAt}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyMsg}>작성한 게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
