import { loginRequest } from '@/api/authApi';
import { useState } from 'react';
import styles from './Login.module.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginRequest(loginData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('nickname', data.user.nickname);
      localStorage.setItem('userId', data.user.id);

      toast.success(`${data.user.nickname}님 환영합니다!`);
      // SPA 방식의 페이지 이동
      navigate('/');
      // 참고: Context API를 쓰지 않는 현재 구조에서는 헤더 갱신을 위해 새로고침이 필요할 수 있으나,
      // 원칙적으로는 navigate를 쓰고 상태를 전역 관리하는 것이 맞습니다.
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || '아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.loginContainer}>
        {/* 헤더: 텍스트 중앙 정렬 */}
        <div className={styles.header}>
          <h2 onClick={() => navigate('/')} className={styles.logo}>
            우진 커뮤니티
          </h2>
        </div>

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
          <span className={styles.divider}> | </span>
          <span onClick={() => navigate('/find-auth')}>ID/PW 찾기</span>

          <span className={styles.divider}> | </span>
          <span onClick={() => navigate('/')} className={styles.homeLink}>
            메인으로
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
