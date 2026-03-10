import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import api from '@/api/axios';

export const useLoginSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const isProcessing = useRef(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      const token = searchParams.get('token');

      if (token) {
        try {
          localStorage.setItem('accessToken', token);
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const { id, nickname } = response.data;
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
};
