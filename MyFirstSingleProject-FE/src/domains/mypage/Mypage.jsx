import { getMyActivity, getMyComments, getMyPosts } from '@/api/userApi';
import { useEffect, useState } from 'react';
import styles from './Mypage.module.css';
import { Link } from 'react-router-dom';
import Pagination from '@/components/Pagination/Pagination';

export default function Mypage() {
  const [activity, setActivity] = useState(null);
  const [posts, setPosts] = useState([]); // 게시글 상태
  const [postPage, setPostPage] = useState(1);
  const [totalPostPages, setTotalPostPages] = useState(1);

  const [comments, setComments] = useState([]); // 댓글 상태
  const [commentPage, setCommentPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);

  const [activeTab, setActiveTab] = useState('posts'); // 현재 탭 상태. 기본값 게시글(작성글)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        setLoading(true);
        // 병렬로 두 API를 동시에 호출합니다.
        const [activityData, postsData, commentsData] = await Promise.all([
          getMyActivity(),
          getMyPosts(postPage),
          getMyComments(commentPage),
        ]);
        setActivity(activityData);

        if (postsData) {
          setPosts(postsData.posts || []);
          setTotalPostPages(postsData.totalPages || 1);
        }

        if (commentsData) {
          setComments(commentsData.comments || []);
          setTotalCommentPages(commentsData.totalPages || 1);
        }
      } catch (error) {
        console.error('데이터 로드 실패', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyData();
  }, [postPage, commentPage]);

  if (loading)
    return (
      <div className={styles.loadingModern}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
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
        <button
          className={activeTab === 'posts' ? styles.activeTab : ''}
          onClick={() => setActiveTab('posts')}
        >
          작성글
        </button>
        <button
          className={activeTab === 'comments' ? styles.activeTab : ''}
          onClick={() => setActiveTab('comments')}
        >
          작성댓글
        </button>
        <button
          className={activeTab === 'settings' ? styles.activeTab : ''}
          onClick={() => setActiveTab('settings')}
        >
          설정
        </button>
      </nav>

      {/* 리스트 영역: activeTab에 따라 다른 목록을 보여줌 */}
      <div className={styles.contentList}>
        {activeTab === 'posts' && (
          <>
            {/* 1. 리스트 부분 */}
            {posts.length > 0 ? (
              <ul className={styles.postList}>
                {posts.map((post) => (
                  <li key={post.id} className={styles.postItem}>
                    <Link to={`/post/${post.id}`} className={styles.postLink}>
                      <div className={styles.postInfo}>
                        <span className={styles.postId}>{post.id}</span>
                        <div className={styles.titleSection}>
                          <span
                            className={
                              post.hasImage
                                ? styles.cameraIcon
                                : styles.talkIcon
                            }
                          >
                            {post.hasImage ? '📷 ' : '💬 '}
                          </span>
                          <span className={styles.postTitle}>{post.title}</span>
                          {post._count?.comments > 0 && (
                            <span className={styles.commentCount}>
                              [{post._count.comments}]
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={styles.postMeta}>
                        <span className={styles.date}>{post.createdAt}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyMsg}>작성한 게시글이 없습니다.</p>
            )}

            <Pagination
              currentPage={postPage}
              totalPages={totalPostPages}
              onPageChange={setPostPage}
            />
          </>
        )}
        {activeTab === 'comments' && (
          <>
            {/* 1. 조건문은 반드시 중괄호 { } 안에 넣어야 합니다 */}
            {comments.length > 0 ? (
              <ul className={styles.postList}>
                {comments.map((comment) => (
                  <li key={comment.id} className={styles.postItem}>
                    <Link
                      to={comment.postId ? `/post/${comment.postId}` : '#'}
                      className={styles.postLink}
                      onClick={(e) => !comment.postId && e.preventDefault()} // 삭제된 글이면 클릭 방지
                    >
                      <div className={styles.postInfo}>
                        <div className={styles.commentContentWrapper}>
                          <span className={styles.postTitle}>
                            {comment.content}
                          </span>
                          <span className={styles.targetPostTitle}>
                            제목: {comment.postTitle}
                          </span>
                        </div>
                      </div>
                      <div className={styles.postMeta}>
                        <span className={styles.date}>{comment.createdAt}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyMsg}>작성한 댓글이 없습니다.</p>
            )}

            {/* 2. 댓글 전용 상태(commentPage, setCommentPage)로 변경 */}
            <Pagination
              currentPage={commentPage}
              totalPages={totalCommentPages}
              onPageChange={setCommentPage}
            />
          </>
        )}

        {activeTab === 'settings' && (
          <div className={styles.settingsArea}>
            <p className={styles.emptyMsg}>설정 페이지 준비 중입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
