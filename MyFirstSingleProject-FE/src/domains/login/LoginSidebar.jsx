import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginSidebar.module.css';

const LoginSidebar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    const savedNickname = localStorage.getItem('nickname');
    return savedToken && savedNickname ? { nickname: savedNickname } : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
    setUser(null);
    window.location.reload();
  };

  if (user) {
    return (
      <div className={styles.sidebarContainer}>
        <div className={styles.userBox}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="profile"
                className={styles.avatarImg}
              />
            </div>
            <div className={styles.userText}>
              <span className={styles.nickname}>
                <strong>{user.nickname}</strong>님
              </span>
              <span className={styles.welcomeMsg}>하이요~ㅎㅎ</span>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={styles.actionBtn}
              onClick={() => navigate('/mypage')}
            >
              마이페이지
            </button>
            <button
              className={`${styles.actionBtn} ${styles.logoutBtn}`}
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.loginBox}>
        <button
          className={styles.sidebarLoginBtn}
          onClick={() => navigate('/Login')}
        >
          로그인
        </button>
        <div className={styles.sidebarFooter}>
          <span onClick={() => navigate('/signup')}>회원가입</span>
          <div className={styles.divider}></div>
          <span onClick={() => navigate('/find-auth')}>ID/PW 찾기</span>
        </div>
      </div>
    </div>
  );
};

export default LoginSidebar;
