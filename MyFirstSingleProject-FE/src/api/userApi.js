import api from './axios';

// 마이페이지
export const getMyActivity = async () => {
  const response = await api.get('/user/activity');
  return response.data.data;
};

//작성글 목록
export const getMyPosts = async () => {
  const response = await api.get('/user/my-posts');
  return response.data.data;
};
