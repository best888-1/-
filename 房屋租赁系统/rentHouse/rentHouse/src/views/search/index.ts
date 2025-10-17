// src/views/search/index.ts
import { type RouteRecordRaw } from 'vue-router';
import SearchView from './SearchView.vue';

const route: RouteRecordRaw = {
  path: '/rooms', // 路由路径
  name: 'RoomSearch', // 路由名称
  component: SearchView, // 对应的组件
  meta: {
    title: '房源检索', // 页面标题
  },
  
};

export default route;