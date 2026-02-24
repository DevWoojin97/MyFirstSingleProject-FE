import api from './axios'; // 공통 설정이 담긴 axios.js 임포트

// 회원가입
export const signupRequest = async (formData) => {
  try {
    const response = await api.post('/auth/signup', formData);
    return response.data;
  } catch (error) {
    console.error('회원가입 에러:', error);
    throw error;
  }
};

// 로그인
export const loginRequest = async (loginData) => {
  try {
    const response = await api.post('/auth/login', loginData);
    return response.data;
  } catch (error) {
    console.error('로그인 에러:', error);
    throw error;
  }
};
