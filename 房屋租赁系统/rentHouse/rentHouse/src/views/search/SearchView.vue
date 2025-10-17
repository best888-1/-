<!-- src/views/search/SearchView.vue -->
<template>
  <div class="search-container">
    <!-- 顶部栏 -->
    <header class="mobile-header">
      <div class="title">房源列表</div>
      <el-icon class="icon" @click="$router.back()">
        <ArrowLeft />
      </el-icon>
    </header>

    <!-- 筛选和排序区 -->
    <div class="filter-bar">
      <el-button type="default" class="filter-btn" @click="showFilterDrawer = true">
        <Filter />
        筛选
      </el-button>
      <el-select v-model="sortType" placeholder="排序" class="sort-select" @change="handleSortChange">
        <el-option label="默认排序" value="" />
        <el-option label="价格从低到高" value="asc" />
        <el-option label="价格从高到低" value="desc" />
      </el-select>
    </div>

    <!-- 筛选抽屉 -->
    <el-drawer v-model="showFilterDrawer" direction="bottom" :with-header="false" :height="isIphoneX ? '85%' : '80%'">
      <div class="drawer-content">
        <div class="drawer-header">
          <h3>筛选条件</h3>
          <el-icon class="close-icon" @click="showFilterDrawer = false"><Close /></el-icon>
        </div>
        <!-- 监听子组件的 search 事件 -->
        <SearchBar @search="handleFilterSearch" @reset="handleFilterReset" />
      </div>
    </el-drawer>

    <!-- 主要内容区 -->
    <main class="search-main">
      <div class="result-stats" v-if="total > 0">
        <span>找到 <strong>{{ total }}</strong> 个符合条件的房源</span>
      </div>

      <div class="room-list">
        <RoomCard v-for="room in roomList" :key="room.id" :room="room" class="room-card-item" />
      </div>

      <div v-if="roomList.length === 0 && !loading" class="empty-state">
        <el-empty description="暂无符合条件的房源" />
      </div>

      <el-loading v-if="loading" fullscreen text="正在加载..." />

      <div class="pagination" v-if="total > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20]"
          :total="total"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
          layout="prev, pager, next"
        />
      </div>
    </main>

    <!-- 移动端底部导航 -->
    <nav class="mobile-nav">
      <router-link to="/" class="nav-item" active-class="active"><el-icon><HomeFilled /></el-icon><span>首页</span></router-link>
      <router-link to="/rooms" class="nav-item" active-class="active"><el-icon><House /></el-icon><span>房源</span></router-link>
      <router-link to="/news" class="nav-item" active-class="active"><el-icon><Message /></el-icon><span>资讯</span></router-link>
      <router-link to="/user" class="nav-item" active-class="active"><el-icon><User /></el-icon><span>我的</span></router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getRoomList } from '@/api/search';
import type { RoomInterface, RoomListQueryInterface } from '@/api/search/types';
import SearchBar from '@/components/search/SearchBar.vue';
import RoomCard from '@/components/search/RoomCard.vue';
import { ArrowLeft, Filter, Close, HomeFilled, House, Message, User } from '@element-plus/icons-vue';

// --- Refs ---
const roomList = ref<RoomInterface[]>([]);
const total = ref<number>(0);
const loading = ref<boolean>(false);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const showFilterDrawer = ref<boolean>(false);
const sortType = ref<string>('');
const isIphoneX = computed(() => /iPhone X|iPhone 11|iPhone 12|iPhone 13|iPhone 14/.test(navigator.userAgent) && window.innerHeight >= 812);

// 用于存储当前的筛选条件
const currentFilters = ref<Omit<RoomListQueryInterface, 'current' | 'size' | 'orderType'>>({});

// --- Methods ---
/**
 * 核心搜索逻辑
 * @param params 完整的搜索参数
 */
const onSearch = async (params: RoomListQueryInterface) => {
  try {
    loading.value = true;
    const response = await getRoomList(params);
    roomList.value = response.data.records || [];
    total.value = response.data.total || 0;
  } catch (error) {
    console.error('获取房源列表失败:', error);
    roomList.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

/**
 * 处理从抽屉筛选组件传来的搜索事件
 * @param filters 从子组件传来的筛选条件
 */
const handleFilterSearch = (filters: Omit<RoomListQueryInterface, 'current' | 'size' | 'orderType'>) => {
  currentFilters.value = filters; // 保存当前筛选条件
  // 合并筛选条件、排序和分页，发起搜索
  onSearch({
    ...filters,
    current: 1, // 筛选后从第一页开始
    size: pageSize.value,
    orderType: sortType.value,
  });
  showFilterDrawer.value = false;
};

/**
 * 处理从抽屉筛选组件传来的重置事件
 */
const handleFilterReset = () => {
  currentFilters.value = {}; // 清空筛选条件
  sortType.value = ''; // 重置排序
  // 用空条件搜索，即加载所有房源
  onSearch({
    current: 1,
    size: pageSize.value,
    orderType: '',
  });
  showFilterDrawer.value = false;
};

/**
 * 处理排序变更
 */
const handleSortChange = () => {
  // 使用当前保存的筛选条件和新的排序方式进行搜索
  onSearch({
    ...currentFilters.value,
    current: 1, // 排序变更后从第一页开始
    size: pageSize.value,
    orderType: sortType.value,
  });
};

/**
 * 处理页码变更
 */
const handlePageChange = (page: number) => {
  currentPage.value = page;
  // 使用当前保存的筛选条件和排序方式，加载新页码的数据
  onSearch({
    ...currentFilters.value,
    current: page,
    size: pageSize.value,
    orderType: sortType.value,
  });
};

/**
 * 处理每页条数变更
 */
const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
  // 页码重置为1
  handlePageChange(1);
};

// --- Lifecycle Hooks ---
// 页面一加载就自动搜索所有房源
onMounted(() => {
  onSearch({
    current: 1,
    size: pageSize.value,
    orderType: '',
  });
});
</script>

<style scoped>
/* 样式部分与之前相同，此处省略，请保持不变 */
/* ... */
</style>