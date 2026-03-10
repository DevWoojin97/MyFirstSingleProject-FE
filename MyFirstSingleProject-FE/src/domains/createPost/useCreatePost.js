import { useEffect } from 'react';
import { createPost } from '@/api/postApi';
import { useAuth } from '@/contexts/AuthContext';
import { useAsync } from '@/hooks/common/useAsync';
import { useForm } from '@/hooks/common/useForm';

export const useCreatePost = () => {
  const { isLoggedIn, nickname: loggedInNickname } = useAuth();
  const { execute, loading: isLoading } = useAsync(createPost);

  // useForm 적용 (기존 formData 구조 유지)
  const {
    values: formData,
    setValues: setFormData,
    setDirectly: handleChange, // 기존 코드에서 (name, value)를 직접 넘기므로 setDirectly 연결
    setDirectly: handleContentChange,
  } = useForm({
    title: '',
    nickname: isLoggedIn ? loggedInNickname : '',
    password: '',
    content: '',
  });

  // 로그인 상태 동기화 (기존 로직 유지)
  useEffect(() => {
    if (isLoggedIn && loggedInNickname !== formData.nickname) {
      setFormData((prev) => ({
        ...prev,
        nickname: loggedInNickname,
      }));
    }
  }, [isLoggedIn, loggedInNickname, formData.nickname, setFormData]);

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
