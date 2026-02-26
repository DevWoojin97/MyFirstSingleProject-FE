import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api', // 서버 주소
  timeout: 5000, // 5초 넘으면 연결 취소
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token'); // 쿠키에서 토큰 읽기
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 헤더에 장착!
  }
  return config;
});

export default api;
