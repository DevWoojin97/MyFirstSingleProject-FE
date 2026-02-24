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
    // 간단한 유효성 검사
    if (!formData.email || !formData.password || !formData.nickname) {
      return toast.warn('모든 빈칸을 채워주세요!');
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
