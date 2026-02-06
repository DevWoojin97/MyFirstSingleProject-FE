import { deletePost, getPostById } from '@/api/postApi';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleEdit = () => {
    navigate(`/post/${id}/edit`);
  };

  const handleDelete = async () => {
    const password = window.prompt('비밀번호를 입력하세요.');

    if (password === null) return; // 취소 누른 경우
    if (password.trim() === '') {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    try {
      await deletePost(id, password);
      alert('성공적으로 삭제되었습니다.');
      navigate('/'); // 삭제 후 목록으로 이동
    } catch (err) {
      if (err.response?.status === 401) {
        alert('비밀번호가 일치하지 않습니다.');
      } else {
        alert('삭제 중 오류가 발생했습니다.');
      }
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
        <button onClick={handleEdit}> 수정</button>
        <button onClick={handleDelete}>삭제</button>
      </div>
    </div>
  );
}
