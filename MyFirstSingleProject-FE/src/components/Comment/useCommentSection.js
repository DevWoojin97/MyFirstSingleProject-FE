import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/hooks/common/useForm';

export const useCommentSection = (onCommentSubmit, onCommentDelete) => {
  const { isLoggedIn, nickname: myNickname, userId: myId } = useAuth();

  // useForm 적용
  const {
    values: commentInput,
    setDirectly: setInputDirectly,
    reset,
  } = useForm({
    nickname: '',
    password: '',
    content: '',
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [isDeletingMyComment, setIsDeletingMyComment] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.content.trim()) {
      toast.warn('댓글 내용을 입력해주세요.');
      return;
    }

    const success = await onCommentSubmit({
      content: commentInput.content,
      nickname: isLoggedIn ? myNickname : commentInput.nickname,
      password: isLoggedIn ? '' : commentInput.password,
    });

    if (success) {
      reset(); // useForm의 리셋 기능 사용
    }
  };

  const handleDeleteClick = (commentId, authorId) => {
    const isMyComment =
      isLoggedIn && authorId && String(myId) === String(authorId);

    const isAnonymous = !authorId;

    if (isMyComment || isAnonymous) {
      setSelectedCommentId(commentId);
      setIsDeletingMyComment(isMyComment);
      setIsDeleteModalOpen(true);
    } else {
      toast.warn('본인의 댓글만 삭제할 수 있습니다.');
    }
  };

  const handleConfirmDelete = async (password) => {
    const success = await onCommentDelete(selectedCommentId, password);
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  return {
    isLoggedIn,
    myNickname,
    myId,
    commentInput,
    isDeleteModalOpen,
    isDeletingMyComment,
    handleSubmit,
    handleDeleteClick,
    handleConfirmDelete,
    setIsDeleteModalOpen,
    setInputDirectly,
  };
};
