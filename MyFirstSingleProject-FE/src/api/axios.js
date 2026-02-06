import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5005/api', // 서버 주소
  timeout: 5000, // 5초 넘으면 연결 취소
});

export default api;
