import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginRequest } from '@/api/authApi';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/hooks/common/useForm';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // useForm 적용
  const { values: loginData, handleChange } = useForm({
    email: '',
    password: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = await loginRequest(loginData);
      login(data.token, data.user.nickname, data.user.id);
      localStorage.setItem('userId', data.user.id);
      toast.success(`${data.user.nickname}님 환영합니다!`);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || '로그인 실패');
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
