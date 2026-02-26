import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // 페이지 이동 감지용

  const { isLoggedIn, nickname, logout, login } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  // 바깥 클릭 감지 로직 (여기 두면 Header가 어디서 쓰이든 작동함)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        우진이의 커뮤니티 게시판
      </h1>

      {/* PC에서는 CSS로 숨길 모바일 전용 영역 */}
      <div className={styles.mobileHeaderRight}>
        {isLoggedIn ? (
          <div className={styles.userContainer} ref={dropdownRef}>
            <div
              className={styles.userInfoWrapper}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                className={styles.headerAvatar}
                alt="me"
              />
              <div className={styles.textGroup}>
                <span className={styles.nickname}>
                  <strong>{nickname}</strong>님
                </span>
                <span className={styles.welcome}>
                  {isMenuOpen ? '닫기 ▲' : '반가워요!'}
                </span>
              </div>
            </div>
            {isMenuOpen && (
              <div className={styles.dropdownMenu}>
                <div
                  className={styles.menuItem}
                  onClick={() => {
                    navigate('/mypage');
                    setIsMenuOpen(false);
                  }}
                >
                  마이페이지
                </div>
                {/* <div
                  className={styles.menuItem}
                  onClick={() => {
                    navigate('/my-posts');
                    setIsMenuOpen(false);
                  }}
                >
                  내 글 보기
                </div> */}
                <div
                  className={`${styles.menuItem} ${styles.logoutBtn}`}
                  onClick={handleLogout}
                >
                  로그아웃
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/Login">
            <button className={styles.mobileLoginBtn}>로그인</button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
