import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api', // 서버 주소
  timeout: 5000, // 5초 넘으면 연결 취소
  withCredentials: true,
});

export default api;
