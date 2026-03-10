import { useEffect, useState } from 'react';
import { getMyActivity, getMyComments, getMyPosts } from '@/api/userApi';

export const useMypage = () => {
  const [activity, setActivity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postPage, setPostPage] = useState(1);
  const [totalPostPages, setTotalPostPages] = useState(1);

  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);

  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        setLoading(true);
        // 병렬로 세 API를 동시에 호출
        const [activityData, postsData, commentsData] = await Promise.all([
          getMyActivity(),
          getMyPosts(postPage),
          getMyComments(commentPage),
        ]);

        setActivity(activityData);

        if (postsData) {
          setPosts(postsData.posts || []);
          setTotalPostPages(postsData.totalPages || 1);
        }

        if (commentsData) {
          setComments(commentsData.comments || []);
          setTotalCommentPages(commentsData.totalPages || 1);
        }
      } catch (error) {
        console.error('데이터 로드 실패', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyData();
  }, [postPage, commentPage]);

  return {
    activity,
    posts,
    postPage,
    totalPostPages,
    comments,
    commentPage,
    totalCommentPages,
    activeTab,
    loading,
    setPostPage,
    setCommentPage,
    setActiveTab,
  };
};
