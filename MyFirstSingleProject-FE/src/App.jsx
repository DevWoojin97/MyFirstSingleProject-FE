import { Route, Routes } from 'react-router';
import Home from './domains/home/pages/Home';
import CreatePost from './domains/createPost/CreatePost';
import PostDetail from './domains/postDetail/PostDetail';
import UpdatePost from './domains/updatePost/UpdatePost';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post/new" element={<CreatePost />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/post/:id/edit" element={<UpdatePost />} />
    </Routes>
  );
}
