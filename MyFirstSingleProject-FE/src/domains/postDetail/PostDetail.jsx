import { getPostById } from '@/api/postApi';
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

  // const handleDelete = () => {
  //   const password
  // }

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
        <button>삭제</button>
      </div>
    </div>
  );
}
