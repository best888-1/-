<template>
  <div class="browsing-history-page">
    <div class="page-header">
      <h1>浏览历史</h1>
    </div>

    <div class="history-list">
      <div 
        v-for="item in historyList" 
        :key="item.id" 
        class="history-item"
      >
        <router-link 
          :to="`/room-detail/${item.roomId}`" 
          class="item-link"
        >
          <div class="item-img">
            <img 
              :src="item.roomGraphVoList[0]?.url || defaultImg" 
              :alt="`${item.apartmentName}${item.roomNumber}`"
            >
          </div>
          <div class="item-info">
            <div class="item-title">
              {{ item.apartmentName }} {{ item.roomNumber }}
            </div>
            <div class="item-location">
              {{ item.provinceName }}{{ item.cityName }}{{ item.districtName }}
            </div>
            <div class="item-time">
              {{ formatTime(item.browseTime) }}
            </div>
            <div class="item-price">¥{{ item.rent }}</div>
          </div>
        </router-link>
      </div>
    </div>

    <div 
      class="empty-state" 
      v-if="historyList.length === 0 && !loading"
    >
      <el-icon style="font-size: 3rem; color: #ccc;">
        <Clock />
      </el-icon>
      <p>暂无浏览历史</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getBrowsingHistory } from '@/api/history';
import { Clock } from '@element-plus/icons-vue'; // 修复图标导入
import { ElMessage, ElIcon } from 'element-plus';
import type { BrowsingHistoryItem } from '@/api/history/type'; // 导入正确的类型

// 默认图片
const defaultImg = 'https://picsum.photos/120/80';

// 数据状态 - 修复类型定义，从never[]改为正确的类型
const historyList = ref<BrowsingHistoryItem[]>([]);
const loading = ref(true);

// 获取浏览历史
const fetchHistoryList = async () => {
  try {
    loading.value = true;
    const res = await getBrowsingHistory();
    historyList.value = res.data.records || [];
  } catch (error) {
    ElMessage.error('获取浏览历史失败');
  } finally {
    loading.value = false;
  }
};

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 页面加载时获取数据
onMounted(() => {
  fetchHistoryList();
});
</script>

<style scoped>
.browsing-history-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 12px;
}

.item-link {
  display: flex;
  text-decoration: none;
  color: #333;
}

.item-img {
  width: 120px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
}

.item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.item-location {
  font-size: 0.875rem;
  color: #606266;
  margin: 4px 0;
}

.item-time {
  font-size: 0.875rem;
  color: #909399;
  margin: 4px 0;
}

.item-price {
  font-size: 1rem;
  color: #f5222d;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #999;
  background-color: #fff;
  border-radius: 12px;
}

.empty-state p {
  margin-top: 20px;
  font-size: 1rem;
}
</style>