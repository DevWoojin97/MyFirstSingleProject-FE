import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getPostById, updatePost } from '@/api/postApi';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

export const useUpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  // 상세 페이지 모달에서 보낸 비밀번호 및 인증 정보
  const passwordFromState = location.state?.password;
  const isMember = location.state?.isMember || isLoggedIn;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    nickname: '',
  });

  // 1. 권한 체크: 인증 정보가 없으면 상세 페이지로 튕겨내기
  useEffect(() => {
    if (!isMember && !passwordFromState) {
      toast.warn('인증이 필요합니다.');
      navigate(`/post/${id}`);
    }
  }, [isMember, passwordFromState, id, navigate]);

  // 2. 초기 데이터 페칭: 수정할 게시글 정보 가져오기
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
        toast.error(
          err.response?.data?.message || '데이터를 불러오지 못했습니다.',
        );
        navigate('/');
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (newContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, passwordFromState, formData);
      toast.success('수정이 완료되었습니다. ✨');
      navigate(`/post/${id}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || '수정 중 오류가 발생했습니다.',
      );
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
