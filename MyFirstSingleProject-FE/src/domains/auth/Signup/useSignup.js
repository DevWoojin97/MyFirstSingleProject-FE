import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signupRequest } from '@/api/authApi';

export const useSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const { email, password, confirmPassword, nickname } = formData;

    // 유효성 검사 로직들
    if (!email || !password || !confirmPassword || !nickname) {
      return toast.warn('모든 빈칸을 채워주세요!', { toastId: 'warn-empty' });
    }
    if (password !== confirmPassword) {
      return toast.error('비밀번호가 일치하지 않습니다.', {
        toastId: 'err-pw-mismatch',
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error('올바른 이메일 형식이 아닙니다.', {
        toastId: 'err-email',
      });
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return toast.error(
        '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.',
        { toastId: 'err-pw-strength' },
      );
    }
    if (nickname.length < 2 || nickname.length > 8) {
      return toast.error('닉네임은 2~8자 사이여야 합니다.');
    }

    setIsLoading(true);
    try {
      const data = await signupRequest(formData);
      toast.success(data.message || '회원가입에 성공했습니다!', {
        toastId: 'success-signup',
      });
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || '회원가입에 실패했습니다.';
      toast.error(errorMsg, { toastId: 'err-signup' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit,
    handleGoogleSignup,
  };
};
