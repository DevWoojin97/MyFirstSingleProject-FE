import styles from './Signup.module.css';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { signupRequest } from '@/api/authApi';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });

  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // [방어 1단계] 중복 제출 방지

    const { email, password, confirmPassword, nickname } = formData;
    // 간단한 유효성 검사
    if (!email || !password || !confirmPassword || !nickname) {
      return toast.warn('모든 빈칸을 채워주세요!', { toastId: 'warn-empty' });
    }

    if (password !== confirmPassword) {
      return toast.error('비밀번호가 일치하지 않습니다.', {
        toastId: 'err-pw-mismatch',
      });
    }
    // 1. 이메일 형식 검사 (정규표현식)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error('올바른 이메일 형식이 아닙니다.', {
        toastId: 'err-email',
      });
    }
    // 2. 비밀번호 강도 검사 (예: 8자 이상, 영문, 숫자 포함)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return toast.error(
        '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.',
        { toastId: 'err-pw-strength' },
      );
    }
    // 3. 닉네임 길이 검사
    if (nickname.length < 2 || nickname.length > 8) {
      return toast.error('닉네임은 2~8자 사이여야 합니다.');
    }
    try {
      // authApi 함수 호출
      const data = await signupRequest(formData);
      toast.success(data.message || '회원가입에 성공했습니다!', {
        toastId: 'success-signup',
      });
      // 가입 성공 시 2초 뒤 메인 페이지로 이동
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || '회원가입에 실패했습니다.';
      toast.error(errorMsg, { toastId: 'err-signup' });
    } finally {
      setIsLoading(false); // [방어 1단계] 중복 제출 방지
    }
  };
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
      </form>
    </div>
  );
}

export default Signup;
