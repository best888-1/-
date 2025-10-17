// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';


export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
   server: {
    proxy: {
      // 1. 匹配所有以 /api 开头的请求
      '/api': {
        target: 'http://localhost:8081', // 2. 转发到后端 8081 服务器
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});