import styles from './Signup.module.css';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { signupRequest } from '@/api/authApi';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, nickname } = formData;
    // 간단한 유효성 검사
    if (!formData.email || !formData.password || !formData.nickname) {
      return toast.warn('모든 빈칸을 채워주세요!');
    }
    // 1. 이메일 형식 검사 (정규표현식)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error('올바른 이메일 형식이 아닙니다.');
    }
    // 2. 비밀번호 강도 검사 (예: 8자 이상, 영문, 숫자 포함)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return toast.error('비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.');
    }
    // 3. 닉네임 길이 검사
    if (nickname.length < 2 || nickname.length > 8) {
      return toast.error('닉네임은 2~8자 사이여야 합니다.');
    }
    try {
      // authApi 함수 호출
      const data = await signupRequest(formData);
      toast.success(data.message || '회원가입에 성공했습니다!');
      // 가입 성공 시 2초 뒤 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || '회원가입에 실패했습니다.';
      toast.error(errorMsg);
    }
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>회원가입</h2>
      <form className={styles.formGroup} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="email"
          placeholder="이메일"
          onChange={handleChange}
        />
        <input
          className={styles.input}
          name="password"
          type="password"
          placeholder="비밀번호"
          onChange={handleChange}
        />
        <input
          className={styles.input}
          name="nickname"
          placeholder="닉네임"
          onChange={handleChange}
        />
        <button type="submit" className={styles.signupBtn}>
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Signup;
