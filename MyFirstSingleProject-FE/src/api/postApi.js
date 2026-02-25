import api from './axios';

//게시글 전체목록 조회
export const getPosts = async ({ page, limit, search, sort, order } = {}) => {
  try {
    const response = await api.get('/posts', {
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
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('상세 게시글 호출 에러:', error);
    throw error;
  }
};

// 게시글 생성
export const createPost = async (postData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/posts', postData, {
      headers: {
        // 토큰이 있으면 실어 보내고, 없으면 안 보냄 (백엔드에서 체크)
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.data;
  } catch (error) {
    console.error('게시글 작성 에러:', error);
    throw error;
  }
};

// 게시글 삭제
export const deletePost = async (id, password) => {
  const token = localStorage.getItem('token');
  const response = await api.delete(`/posts/${id}`, {
    data: { password },
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
};

export const updatePost = async (id, password, postData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.patch(
      `/posts/${Number(id)}`,
      {
        password,
        ...postData,
      },
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('게시글 수정 에러:', error);
    throw error;
  }
};

//댓글 작성
export const createComment = async (postId, commentData) => {
  const token = localStorage.getItem('token');
  // commentData = { nickname, password, content }
  const response = await api.post(`/posts/${postId}/comments`, commentData, {
    headers: {
      // 토큰이 있으면 실어 보내고, 없으면 안 보냄 (백엔드에서 체크)
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
};
// 7. 댓글 삭제
export const deleteComment = async (commentId, password) => {
  const token = localStorage.getItem('token');
  const response = await api.patch(
    `/posts/comments/${commentId}`,
    {
      password,
    },
    {
      headers: {
        // 토큰이 있으면 실어 보내고, 없으면 안 보냄 (백엔드에서 체크)
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    },
  );
  return response.data;
};
// 비밀번호 검증용 (모달)
export const checkPostPassword = async (id, password) => {
  try {
    const response = await api.post(`/posts/${id}/verify`, { password });
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage =
        error.response.data.message || '비밀번호가 일치하지 않습니다.';
      throw new Error(errorMessage);
    }

    throw new Error('서버와 통신 중 오류가 발생했습니다.');
  }
};

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file); // 여기서 'image'는 백엔드와 맞춘 Key 이름(백엔드 multer.single('image')와 일치)

    const response = await api.post('/posts/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // 파일을 보낼 때는 필수 설정
      },
    });
    return response.data; // { url: "...", filename: "..." } 반환
  } catch (error) {
    console.error('이미지 업로드 API 에러:', error);
    throw error;
  }
};
