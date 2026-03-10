import styles from './LoginSuccess.module.css';
import { useLoginSuccess } from '@/domains/auth/LoginSuccess/useLoginSuccess';

function LoginSuccess() {
  useLoginSuccess(); // 로직 실행

  return (
    <div className={styles.successPageWrapper}>
      <div className={styles.statusContainer}>
        <div className={styles.spinner}></div>
        <h2 className={styles.statusTitle}>로그인 처리 중</h2>
        <p className={styles.statusText}>
          사용자 정보를 안전하게 불러오고 있습니다...
        </p>
      </div>
    </div>
  );
}

export default LoginSuccess;
