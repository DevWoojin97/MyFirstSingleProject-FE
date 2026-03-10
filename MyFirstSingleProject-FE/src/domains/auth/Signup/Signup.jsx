import styles from './Signup.module.css';
import { FcGoogle } from 'react-icons/fc';
import { useSignup } from '@/domains/auth/Signup/useSignup';

function Signup() {
  const {
    formData,
    isLoading,
    handleChange,
    handleSubmit,
    handleGoogleSignup,
  } = useSignup();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>회원가입</h2>
      <form className={styles.formGroup} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="email"
          type="email"
          placeholder="이메일"
          onChange={handleChange}
          value={formData.email}
        />
        <input
          className={styles.input}
          name="password"
          type="password"
          placeholder="비밀번호"
          onChange={handleChange}
          value={formData.password}
        />
        <input
          className={styles.input}
          name="confirmPassword"
          type="password"
          placeholder="비밀번호 확인"
          onChange={handleChange}
          value={formData.confirmPassword}
        />
        <input
          className={styles.input}
          name="nickname"
          placeholder="닉네임"
          onChange={handleChange}
          value={formData.nickname}
        />

        <button type="submit" className={styles.signupBtn} disabled={isLoading}>
          {isLoading ? '가입 중...' : '회원가입'}
        </button>

        <button
          type="button"
          className={styles.googleLoginBtn}
          onClick={handleGoogleSignup}
        >
          <div className={styles.googleIconWrapper}>
            <FcGoogle size={20} />
          </div>
          <span className={styles.googleText}>구글로 간편 가입하기</span>
        </button>
      </form>
    </div>
  );
}

export default Signup;
