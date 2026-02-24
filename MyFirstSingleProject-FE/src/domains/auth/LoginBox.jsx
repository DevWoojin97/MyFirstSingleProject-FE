import { loginRequest } from '@/api/authApi';
import { useEffect, useState } from 'react';
import styles from './LoginBox.module.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function LoginBox() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    const savedNickname = localStorage.getItem('nickname');

    // 처음부터 값이 있으면 그 값을 쓰고, 없으면 null을 씁니다.
    return savedToken && savedNickname ? { nickname: savedNickname } : null;
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginRequest(loginData);
      const nickname = data.user.nickname;
      const userId = data.user.id;
      toast.success(`${nickname}님 환영합니다!`);

      // 로컬스토리지에 토큰과 닉네임 저장
      localStorage.setItem('token', data.token);
      localStorage.setItem('nickname', nickname);
      localStorage.setItem('userId', userId);
      // 2. 유저 정보 저장 (UI 변경용)
      setUser({ nickname, userId });
      // 로그인 성공 후 입력창 비우기
      setLoginData({ email: '', password: '' });
    } catch (error) {
      const serverMessage = error.response?.data?.message; // 서버가 보내준 구체적인 에러 (ex: "탈퇴한 계정입니다")
      toast.error(serverMessage || '아이디 또는 비밀번호가 틀렸습니다.');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    setUser(null);
    toast.info('로그아웃 되었습니다.');
  };
  if (user) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.userBox}>
          {/* 왼쪽: 프로필 정보 (아바타 + 닉네임 + 인사말) */}
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{user.nickname.charAt(0)}</div>
            <div className={styles.userText}>
              <span className={styles.nickname}>
                <strong>{user.nickname}</strong>님
              </span>
              <span className={styles.welcomeMsg}>반갑습니다!</span>
            </div>
          </div>

          {/* 오른쪽: 버튼 그룹 (마이페이지 + 로그아웃) */}
          <div className={styles.buttonGroup}>
            <span
              className={styles.actionLink}
              onClick={() => navigate('/mypage')}
            >
              마이페이지
            </span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.loginContainer}>
      {/* className 추가로 간격과 정렬을 제어합니다 */}
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <input
          name="email"
          placeholder="이메일"
          className={styles.input}
          onChange={handleChange}
          value={loginData.email}
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          className={styles.input}
          onChange={handleChange}
          value={loginData.password}
        />
        <button type="submit" className={styles.loginBtn}>
          로그인
        </button>
      </form>

      <div className={styles.footer}>
        <span onClick={() => navigate('/signup')}>회원가입</span>
        <span>ID/PW 찾기</span>
      </div>
    </div>
  );
}
export default LoginBox;
