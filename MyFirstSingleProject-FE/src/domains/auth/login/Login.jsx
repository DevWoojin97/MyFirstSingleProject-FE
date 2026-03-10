import styles from './Login.module.css';
import { FcGoogle } from 'react-icons/fc';
import { useLogin } from '@/domains/auth/login/useLogin';

function Login() {
  const {
    loginData,
    isLoading,
    handleChange,
    handleLogin,
    handleGoogleLogin,
    navigate,
  } = useLogin();

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.loginContainer}>
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
          <button
            type="submit"
            className={styles.loginBtn}
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          <button
            type="button"
            className={styles.googleLoginBtn}
            onClick={handleGoogleLogin}
          >
            <div className={styles.googleIconWrapper}>
              <FcGoogle size={20} />
            </div>
            <span className={styles.googleText}>구글로 시작하기</span>
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
