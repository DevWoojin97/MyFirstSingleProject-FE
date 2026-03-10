// src/hooks/useCreatePost.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createPost } from '@/api/postApi';
import { useAuth } from '@/contexts/AuthContext';

export const useCreatePost = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, nickname: loggedInNickname } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    nickname: isLoggedIn ? loggedInNickname : '',
    password: '',
    content: '',
  });

  // 로그인 상태 변화 감지
  useEffect(() => {
    if (isLoggedIn) {
      setFormData((prev) => ({ ...prev, nickname: loggedInNickname }));
    }
  }, [isLoggedIn, loggedInNickname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사 (Woojin님의 기존 로직 그대로)
    if (!isLoggedIn) {
      if (!formData.nickname.trim())
        return toast.warn('닉네임을 입력해주세요! 👤');
      if (!formData.password) return toast.warn('비밀번호를 입력해주세요! 🔒');
      if (formData.password.length < 4 || formData.password.length > 8) {
        return toast.warn('비밀번호는 4자에서 8자 사이여야 합니다!');
      }
    }
    if (!formData.title.trim()) return toast.warn('제목을 입력해주세요! ✍️');

    const isContentEmpty =
      !formData.content ||
      formData.content.replace(/<(.|\n)*?>/g, '').trim().length === 0;
    if (isContentEmpty) return toast.warn('내용을 입력해주세요! 📝');

    setIsLoading(true);
    try {
      const submitData = isLoggedIn ? { ...formData, password: '' } : formData;
      await createPost(submitData);
      toast.success('게시글이 등록되었습니다. ✨');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || '등록 실패');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    isLoggedIn,
    handleChange,
    handleContentChange,
    handleSubmit,
  };
};
