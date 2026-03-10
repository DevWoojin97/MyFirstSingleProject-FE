import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '@/api/postApi';
import api from '@/api/axios';
import { useAsync } from '@/hooks/common/useAsync'; // 👈 import 확인!

const DEBOUNCE_DELAY = 500;
const LIMIT = 15;

export const useHome = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  // 1. useAsync 사용 (이름을 isLoading으로 변경해서 받기)
  const {
    execute: fetchPosts,
    loading: isLoading, // 👈 loading을 isLoading이라는 이름으로 사용
    isLongLoading,
  } = useAsync(getPosts, true);

  // 서버 깨우기 (Ping) - 이 로직은 그대로 둡니다.
  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        await api.get('/posts/ping');
      } catch (error) {
        console.log('💤 서버가 아직 자고 있거나 깨어나는 중입니다.', error);
      }
    };
    wakeUpServer();
  }, []);

  // 게시글 가져오기 (디바운스 포함)
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      // 2. fetchPosts는 이미 useAsync 내부에서 try-catch와 로딩 처리를 다 해줍니다.
      const result = await fetchPosts({
        search: searchTerm,
        page: currentPage,
        limit: LIMIT,
      });

      if (result) {
        setPosts(result.posts || []);
        setTotalCount(result.totalCount || 0);
        setTotalPages(result.totalPages || 1);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, currentPage, fetchPosts]);

  // 핸들러 함수
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return {
    posts,
    currentPage,
    totalPages,
    searchTerm,
    isLoading, // 👈 useAsync에서 온 값
    isLongLoading, // 👈 useAsync에서 온 값
    handleSearchChange,
    handlePageChange,
    navigate,
    totalCount, // 혹시 화면에 총 개수 표시하신다면 이것도 반환!
  };
};
