import { useNavigate } from 'react-router-dom';
import styles from './LoginSidebar.module.css';
import { useAuth } from '@/contexts/AuthContext';

const LoginSidebar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, nickname, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (isLoggedIn) {
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
                <strong>{nickname}</strong>님
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
