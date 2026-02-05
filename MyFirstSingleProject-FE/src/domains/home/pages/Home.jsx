import { Link } from 'react-router-dom';

const Home = ({ posts }) => {
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
                <td>{post.no}</td>
                <td>
                  <Link to={`/post/${post.id}`}>{post.title}</Link>
                </td>
                <td>{post.nickname}</td>
                <td>{post.createdAt}</td>
                <td>{post.views}</td>
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
