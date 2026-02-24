import { Route, Routes } from 'react-router';
import Home from './domains/home/pages/Home';
import CreatePost from './domains/createPost/CreatePost';
import PostDetail from './domains/postDetail/PostDetail';
import UpdatePost from './domains/updatePost/UpdatePost';
import { ToastContainer } from 'react-toastify';
import Signup from './domains/auth/Signup';
import Mypage from './domains/mypage/Mypage';

export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right" // 위치
        autoClose={3000} // 3초 뒤 자동 종료
        hideProgressBar={false}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/post/new" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/post/:id/edit" element={<UpdatePost />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </>
  );
}
