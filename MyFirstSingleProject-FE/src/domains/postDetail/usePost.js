import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getPostById, checkPostPassword, deletePost } from '@/api/postApi';
import { useAuth } from '@/contexts/AuthContext';
import { useAsync } from '@/hooks/common/useAsync';

export const usePost = (id) => {
  const navigate = useNavigate();
  const { userId, nickname, isLoggedIn } = useAuth();

  const [post, setPost] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { execute: fetchPostRequest, loading } = useAsync(getPostById);
  const { execute: checkPasswordRequest } = useAsync(checkPostPassword);
  const { execute: deletePostRequest } = useAsync(deletePost);

  const currentUser = isLoggedIn ? { id: userId, nickname } : null;

  const isMyPost =
    post?.authorId &&
    currentUser?.id &&
    String(post.authorId) === String(currentUser.id);

  const fetchPost = async () => {
    try {
      const data = await fetchPostRequest(id);
      setPost(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleGoToList = () => navigate('/');

  const handleActualEdit = async (password) => {
    try {
      await checkPasswordRequest(id, password);
      setIsEditModalOpen(false);
      navigate(`/post/${id}/edit`, { state: { password } });
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || '비밀번호 오류';
      toast.error(errorMsg);
    }
  };

  const handleActualDelete = async (password = null) => {
    try {
      await deletePostRequest(id, password);
      setIsDeleteModalOpen(false);
      toast.success('성공적으로 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || '삭제 실패';
      toast.error(errorMsg);
    }
  };

  const handleEditClick = () => {
    if (isMyPost) {
      navigate(`/post/${id}/edit`, { state: { isMember: true } });
    } else if (post?.authorId) {
      toast.warn('본인의 글만 수정할 수 있습니다. ✋');
    } else {
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteClick = () => {
    if (isMyPost) {
      setIsDeleteModalOpen(true);
    } else if (post?.authorId) {
      toast.warn('본인의 글만 삭제할 수 있습니다. ✋');
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  return {
    post,
    loading,
    isMyPost,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    handleGoToList,
    handleEditClick,
    handleDeleteClick,
    handleActualEdit,
    handleActualDelete,
    fetchPost,
  };
};
