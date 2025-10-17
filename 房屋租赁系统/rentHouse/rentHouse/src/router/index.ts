// src/router/index.ts
import { useUserStore } from '@/store/modules/user';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
// 1. 导入房源检索页面的路由配置
import searchRoute from '@/views/search';
import otherRoutes from './otherRoutes';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { 
      ignoreAuth: true, // 无需登录
      title: '登录'
    }
  },
  
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: { 
      title: '首页' // 需要登录
    }
  },

  // 2. 添加房源检索页面的路由
  searchRoute,

  ...otherRoutes,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title as string || '尚庭公寓';

  if (to.meta.ignoreAuth) {
    return next();
  }

  // 正确逻辑：直接从Pinia获取token
  const userStore = useUserStore();
  if (!userStore.token) { 
    // 没有token，强制跳登录页
    return next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }

  // 检查用户信息（如果获取失败，同样跳登录）
  if (!userStore.userInfo) {
    try {
      await userStore.getUserInfo();
    } catch (error) {
      userStore.logout();
      return next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
    }
  }

  next();
});

export default router;