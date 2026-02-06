import { useNavigate, useParams } from 'react-router-dom';

export default function PostDetail({ posts }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = posts.find((p) => p.id === parseInt(id));

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
          작성일: {post.createdAt} | 조회수: {post.views}
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
