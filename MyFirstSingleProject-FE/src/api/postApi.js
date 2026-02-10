import axios from 'axios';

const BASE_URL = 'http://localhost:5050/api';

//게시글 전체목록 조회
export const getPosts = async ({ page, limit, search, sort, order } = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/posts`, {
      params: { page, limit, search, sort, order },
    });
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

export const updatePost = async (id, password, postData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/posts/${id}`, {
      password,
      ...postData,
    });
    return response.data;
  } catch (error) {
    console.error('게시글 수정 에러:', error);
    throw error;
  }
};

//댓글 작성
export const createComment = async (postId, commentData) => {
  // commentData = { nickname, password, content }
  const response = await axios.post(
    `${BASE_URL}/posts/${postId}/comments`,
    commentData,
  );
  return response.data;
};

// // 비밀번호 검증용 (모달)
// export const checkPostPassword = async (id, password) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/post/${id}/check-password`, {
//       password: password,
//     });
//     return 'OK';
//   } catch (error) {
//     if (error.response) {
//       const errorMessage =
//         error.response.data.message || '비밀번호가 일치하지 않습니다.';
//       throw new Error(errorMessage);
//     }

//     throw new Error('서버와 통신 중 오류가 발생했습니다.');
//   }
// };
