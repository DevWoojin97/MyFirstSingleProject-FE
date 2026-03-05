import api from './axios';

// 마이페이지
export const getMyActivity = async () => {
  const response = await api.get('/user/activity');
  return response.data.data;
};

//작성글 목록
export const getMyPosts = async (page = 1) => {
  const response = await api.get(`/user/my-posts?page=${page}`);
  return response.data.data;
};

//댓글 목록
export const getMyComments = async (page = 1) => {
  const response = await api.get(`/user/my-comments?page=${page}`);
  return response.data.data;
};
