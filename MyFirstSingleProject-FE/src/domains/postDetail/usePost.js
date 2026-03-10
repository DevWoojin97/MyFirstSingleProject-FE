import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getPostById, checkPostPassword, deletePost } from '@/api/postApi';
import { useAuth } from '@/contexts/AuthContext';

export const usePost = (id) => {
  const navigate = useNavigate();
  const { userId, nickname, isLoggedIn } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const currentUser = isLoggedIn ? { id: userId, nickname } : null;

  const isMyPost =
    post?.authorId &&
    currentUser?.id &&
    String(post.authorId) === String(currentUser.id);

  const fetchPost = useCallback(async () => {
    try {
      const data = await getPostById(id);
      setPost(data);
    } catch (error) {
      console.error('데이터 로드 실패', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleGoToList = () => navigate('/');

  const handleEditClick = () => {
    const loggedInId = localStorage.getItem('userId');
    const postAuthorId = post?.authorId;
    const isOwner =
      loggedInId && postAuthorId && String(loggedInId) === String(postAuthorId);
    if (isOwner) {
      navigate(`/post/${id}/edit`, { state: { isMember: true } });
    } else if (post?.authorId) {
      toast.warn('본인의 글만 수정할 수 있습니다. ✋');
    } else {
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteClick = () => {
    const loggedInId = localStorage.getItem('userId');
    const postAuthorId = post?.authorId;
    const isOwner =
      loggedInId && postAuthorId && String(loggedInId) === String(postAuthorId);

    if (isOwner) {
      setIsDeleteModalOpen(true);
    } else if (post?.authorId) {
      toast.warn('본인의 글만 삭제할 수 있습니다. ✋');
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const handleActualEdit = async (password) => {
    try {
      await checkPostPassword(id, password);
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
      await deletePost(id, password);
      setIsDeleteModalOpen(false);
      toast.success('성공적으로 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || '삭제 실패';
      toast.error(errorMsg);
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
    fetchPost,
    handleGoToList,
    handleEditClick,
    handleDeleteClick,
    handleActualEdit,
    handleActualDelete,
  };
};
