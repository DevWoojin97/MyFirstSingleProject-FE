import { useState } from 'react';
import { Route, Routes } from 'react-router';
import Home from './domains/home/pages/Home';
import CreatePost from './domains/createPost/CreatePost';
import PostDetail from './domains/postDetail/PostDetail';
import UpdatePost from './domains/updatePost/UpdatePost';

export default function App() {
  const [posts, setPosts] = useState([
    {
      id: 2,
      no: 105,
      title: '오늘 점심 뭐 먹지?',
      nickname: '우진',
      content: '추천 좀 해주셈',
      password: '1234',
      createdAt: '2024.05.22',
      views: 42,
    },
  ]);
  console.log('현재 게시글 목록:', posts);
  return (
    <Routes>
      <Route path="/" element={<Home posts={posts} />} />
      <Route path="/post/new" element={<CreatePost setPosts={setPosts} />} />
      <Route path="/post/:id" element={<PostDetail posts={posts} />} />
      <Route
        path="/post/:id/edit"
        element={<UpdatePost posts={posts} setPosts={setPosts} />}
      />
    </Routes>
  );
}
