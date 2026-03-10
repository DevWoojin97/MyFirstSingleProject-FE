import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getPostById, updatePost } from '@/api/postApi';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/hooks/common/useForm';

export const useUpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const passwordFromState = location.state?.password;
  const isMember = location.state?.isMember || isLoggedIn;

  // useForm 적용
  const {
    values: formData,
    setValues: setFormData,
    handleChange,
    setDirectly: handleContentChange,
  } = useForm({
    title: '',
    content: '',
    nickname: '',
  });

  useEffect(() => {
    if (!isMember && !passwordFromState) {
      toast.warn('인증이 필요합니다.');
      navigate(`/post/${id}`);
    }
  }, [isMember, passwordFromState, id, navigate]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setFormData({
          title: data.title || '',
          content: data.content || '',
          nickname: data.nickname || '',
        });
      } catch (err) {
        toast.error('데이터 로드 실패');
        navigate('/');
      }
    };
    fetchPost();
  }, [id, navigate, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, passwordFromState, formData);
      toast.success('수정 완료 ✨');
      navigate(`/post/${id}`);
    } catch (err) {
      toast.error('수정 실패');
    }
  };

  return {
    formData,
    handleChange,
    handleContentChange,
    handleSubmit,
    navigate,
  };
};
