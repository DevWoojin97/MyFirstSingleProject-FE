import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

export const useCommentSection = (onCommentSubmit, onCommentDelete) => {
  const { isLoggedIn, nickname: myNickname, userId: myId } = useAuth();

  const [commentInput, setCommentInput] = useState({
    nickname: '',
    password: '',
    content: '',
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [isDeletingMyComment, setIsDeletingMyComment] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!commentInput.content || commentInput.content.trim() === '') {
      toast.warn('댓글 내용을 입력해주세요.');
      return;
    }

    const submitData = {
      content: commentInput.content,
      nickname: isLoggedIn ? myNickname : commentInput.nickname,
      password: isLoggedIn ? '' : commentInput.password,
    };

    onCommentSubmit(submitData, () => {
      setCommentInput({ nickname: '', password: '', content: '' });
    });
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
    } else {
      toast.error('삭제에 실패했습니다. 비밀번호를 확인해주세요.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommentInput((prev) => ({ ...prev, [name]: value }));
  };

  // 수동 업데이트용 (원래 코드 스타일 유지)
  const setInputDirectly = (key, value) => {
    setCommentInput((prev) => ({ ...prev, [key]: value }));
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
