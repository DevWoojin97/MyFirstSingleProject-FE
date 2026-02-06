import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        // 리액트 19 컴파일러: 불필요한 리렌더링 방지
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
  },
  envDir: './env',
});
