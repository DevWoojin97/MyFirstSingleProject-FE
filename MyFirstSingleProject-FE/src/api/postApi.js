import axios from 'axios';

const BASE_URL = 'http://localhost:5050/api';

//게시글 전체목록 조회
export const getPosts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/posts`);
    return response.data; // 데이터만 쏙 뽑아서 반환
  } catch (error) {
    console.error('API 호출 에러:', error);
    throw error; // 에러가 나면 컴포넌트에서 알 수 있게 던져줍니다.
  }
};
// 상세 게시글
export const getPostById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('상세 게시글 호출 에러:', error);
    throw error;
  }
};

// 게시글 생성
export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${BASE_URL}/posts`, postData);
    return response.data;
  } catch (error) {
    console.error('게시글 작성 에러:', error);
    throw error;
  }
};

// 게시글 삭제
export const deletePost = async (id, password) => {
  const response = await axios.delete(`${BASE_URL}/posts/${id}`, {
    data: { password },
  });
  return response.data;
};
