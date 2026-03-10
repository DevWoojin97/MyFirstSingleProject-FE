import styles from './Mypage.module.css';
import { Link } from 'react-router-dom';
import Pagination from '@/components/Pagination/Pagination';
import { useMypage } from '@/domains/mypage/useMypage'; // 훅 임포트

export default function Mypage() {
  const {
    activity,
    posts,
    postPage,
    totalPostPages,
    comments,
    commentPage,
    totalCommentPages,
    activeTab,
    loading,
    setPostPage,
    setCommentPage,
    setActiveTab,
  } = useMypage();

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

      <div className={styles.contentList}>
        {activeTab === 'posts' && (
          <>
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
            {comments.length > 0 ? (
              <ul className={styles.postList}>
                {comments.map((comment) => (
                  <li key={comment.id} className={styles.postItem}>
                    <Link
                      to={
                        comment.postId
                          ? `/post/${comment.postId}#comment-${comment.id}`
                          : '#'
                      }
                      className={styles.postLink}
                      onClick={(e) => !comment.postId && e.preventDefault()}
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
