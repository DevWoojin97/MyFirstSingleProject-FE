import { getPosts } from '@/api/postApi';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
      }
    };

    fetchPosts();
  }, []);
  return (
    <div>
      <h1>커뮤니티 게시판</h1>
      <table border="1">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>글쓴이</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => {
            return (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>
                  <Link to={`/post/${post.id}`}>{post.title}</Link>
                </td>
                <td>{post.nickname}</td>
                <td>{new Date(post.createdAt).toLocaleString()}</td>
                <td>{post.view}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link to={'/post/new'}>
        <button>글쓰기</button>
      </Link>
    </div>
  );
};

export default Home;
