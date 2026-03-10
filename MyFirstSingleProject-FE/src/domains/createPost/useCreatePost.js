// src/domains/createPost/useCreatePost.js
import { useState, useEffect } from 'react';
import { createPost } from '@/api/postApi';
import { useAuth } from '@/contexts/AuthContext';
import { useAsync } from '@/hooks/useAsync';

export const useCreatePost = () => {
  const { isLoggedIn, nickname: loggedInNickname } = useAuth();

  const { execute, loading: isLoading } = useAsync(createPost);

  const [formData, setFormData] = useState({
    title: '',
    nickname: isLoggedIn ? loggedInNickname : '',
    password: '',
    content: '',
  });

  // 로그인 상태 동기화
  useEffect(() => {
    if (isLoggedIn && loggedInNickname !== formData.nickname) {
      setFormData((prev) => ({
        ...prev,
        nickname: loggedInNickname,
      }));
    }
  }, [isLoggedIn, loggedInNickname, formData.nickname]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const create = async () => {
    const submitData = isLoggedIn ? { ...formData, password: '' } : formData;

    return await execute(submitData);
  };

  return {
    formData,
    isLoading,
    isLoggedIn,
    handleChange,
    handleContentChange,
    create,
  };
};
