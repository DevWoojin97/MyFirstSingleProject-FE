import { deletePost, getPostById, updatePost } from '@/api/postApi';
import PasswordModal from '@/components/PasswordModal/PasswordModal';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (error) {
        console.error('데이터 로드 실패', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleGoToList = () => {
    navigate('/');
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleActualEdit = async (password) => {
    try {
      await updatePost(id, password);

      setIsEditModalOpen(false);
      navigate(`/post/${id}/edit`, { state: { password } });
    } catch (error) {
      toast.error('비밀번호가 일치하지 않습니다. 🙅');
      throw new Error(
        error.response?.data?.message || '비밀번호가 일치하지 않습니다.',
      );
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleActualDelete = async (password) => {
    try {
      await deletePost(id, password);

      setIsDeleteModalOpen(false);
      toast.success('성공적으로 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      toast.error(
        error.response?.data?.message || '비밀번호가 일치하지 않습니다.',
      );
    }
  };

  if (!post) {
    return <div>존재하지 않는 게시글입니다.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>{post.title}</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid #ccc',
        }}
      >
        <span>
          작성자: <strong>{post.nickname}</strong>
        </span>
        <span>
          작성일:{new Date(post.createdAt).toLocaleDateString()} | 조회수:
          {post.view}
        </span>
      </div>

      <div style={{ padding: '40px 0', minHeight: '200px' }}>
        {post.content}
      </div>

      <hr />

      <div>
        <button onClick={handleGoToList}>목록으로</button>
        <button onClick={handleEditClick}> 수정</button>
        <button onClick={handleDeleteClick}>삭제</button>
      </div>

      <PasswordModal
        id={id}
        isOpen={isEditModalOpen}
        title="게시글 수정"
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleActualEdit}
      />

      <PasswordModal
        id={id}
        isOpen={isDeleteModalOpen}
        title="게시글 삭제"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleActualDelete}
      />
    </div>
  );
}
