import { useEffect } from 'react';

export const useInAppBrowserHandler = () => {
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const targetUrl = window.location.href;

    // 카카오톡 브라우저인지 확인
    if (userAgent.includes('kakaotalk')) {
      // 안드로이드: 크롬으로 강제 이동
      if (userAgent.includes('android')) {
        window.location.href = `intent://${targetUrl.replace(/https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      }
      // 아이폰/아이패드: 외부 브라우저(사파리)로 열기
      else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        window.location.href = `kakaotalk://web/openExternalApp?url=${encodeURIComponent(targetUrl)}`;
      }
    }
  }, []);
};
