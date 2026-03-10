import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '@/api/postApi';
import api from '@/api/axios';

const DEBOUNCE_DELAY = 500;
const LIMIT = 15;

export const useHome = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLongLoading, setIsLongLoading] = useState(false);

  // 서버 깨우기 (Ping)
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
    const debounceTimer = setTimeout(() => {
      const fetchPosts = async () => {
        setIsLoading(true);
        setIsLongLoading(false);

        const longLoadingTimer = setTimeout(() => {
          setIsLongLoading(true);
        }, 5000);

        try {
          const result = await getPosts({
            search: searchTerm,
            page: currentPage,
            limit: LIMIT,
          });

          const newPosts = result.posts || [];
          setPosts(newPosts);
          setTotalCount(result.totalCount || 0);
          setTotalPages(result.totalPages || 1);
        } catch (error) {
          console.error('데이터 로딩 실패:', error);
        } finally {
          setIsLoading(false);
          clearTimeout(longLoadingTimer);
        }
      };

      fetchPosts();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, currentPage]);

  // 핸들러 함수
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 컴포넌트에서 필요한 것들만 반환
  return {
    posts,
    currentPage,
    totalPages,
    searchTerm,
    isLoading,
    isLongLoading,
    handleSearchChange,
    handlePageChange,
    navigate, // 테이블 클릭 시 사용
  };
};
