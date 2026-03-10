import { useState, useCallback } from 'react';

export const useAsync = (asyncFunction, initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const [isLongLoading, setIsLongLoading] = useState(false); // 5초 이상 지연 상태
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setIsLongLoading(false);
      setError(null);

      // 5초 뒤에 실행될 타이머 설정 (useHome 로직 공통화)
      const longLoadingTimer = setTimeout(() => {
        setIsLongLoading(true);
      }, 5000);

      try {
        const response = await asyncFunction(...args);
        return response;
      } catch (err) {
        setError(err);
        throw err; // 필요 시 상위 컴포넌트에서 catch 할 수 있게 던짐
      } finally {
        setLoading(false);
        clearTimeout(longLoadingTimer); // 요청 끝나면 타이머 해제
      }
    },
    [asyncFunction],
  );

  return { execute, loading, isLongLoading, error };
};
