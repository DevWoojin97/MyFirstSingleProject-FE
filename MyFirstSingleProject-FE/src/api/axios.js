import axios from 'axios';

const api = axios.create({
  baseURL: 'https://myfirstsingleproject-be.onrender.com/api', // 서버 주소
  timeout: 5000, // 5초 넘으면 연결 취소
});

export default api;
