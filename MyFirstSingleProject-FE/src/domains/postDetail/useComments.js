import { toast } from 'react-toastify';
import { createComment, deleteComment } from '@/api/postApi';

export const useComments = (id, fetchPost) => {
  const handleCommentSubmit = async (commentData, successCallback) => {
    try {
      await createComment(id, commentData);
      toast.success('댓글이 등록되었습니다. 💬');
      successCallback();
      fetchPost();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || '실패';
      toast.error(errorMsg);
    }
  };

  const handleDeleteComment = async (commentId, password) => {
    try {
      await deleteComment(commentId, password);
      toast.success('댓글이 삭제되었습니다. 🗑️');
      fetchPost();
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || '실패';
      toast.error(errorMsg);
      return false;
    }
  };

  return { handleCommentSubmit, handleDeleteComment };
};
