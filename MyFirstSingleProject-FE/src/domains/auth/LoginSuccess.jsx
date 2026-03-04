import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '@/api/axios'; // axios 설정 파일
import styles from './LoginSuccess.module.css';

function LoginSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const isProcessing = useRef(false); // StrictMode 중복 실행 방지

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      const token = searchParams.get('token');

      if (token) {
        try {
          // 1. 임시로 토큰 저장 (API 호출을 위해)
          localStorage.setItem('accessToken', token);

          // 2. ⭐️ 서버에 실제 유저 정보 요청 (보안상 가장 안전)
          // 이 요청은 헤더에 방금 저장한 토큰이 실려가야 합니다.
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const { id, nickname } = response.data;

          // 3. AuthContext 업데이트
          login(token, nickname, id);
          localStorage.setItem('userId', id);

          toast.success(`${nickname}님 환영합니다!`, {
            toastId: 'google-login-success',
          });
          navigate('/');
        } catch (error) {
          console.error('유저 정보 로드 실패:', error);
          toast.error('로그인 처리 중 오류가 발생했습니다.');
          navigate('/login');
        }
      } else {
        toast.error('토큰이 유효하지 않습니다.');
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [searchParams, navigate, login]);

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
