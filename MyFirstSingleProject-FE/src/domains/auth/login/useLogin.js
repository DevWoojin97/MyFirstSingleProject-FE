import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginRequest } from '@/api/authApi';
import { useAuth } from '@/contexts/AuthContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = await loginRequest(loginData);
      login(data.token, data.user.nickname, data.user.id);
      localStorage.setItem('userId', data.user.id);

      toast.success(`${data.user.nickname}님 환영합니다!`, {
        toastId: 'login-success',
      });
      navigate('/');
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || '아이디 또는 비밀번호가 틀렸습니다.', {
        toastId: 'login-error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return {
    loginData,
    isLoading,
    handleChange,
    handleLogin,
    handleGoogleLogin,
    navigate,
  };
};
