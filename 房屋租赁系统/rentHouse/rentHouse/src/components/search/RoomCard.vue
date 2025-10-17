<!-- src/components/search/RoomCard.vue -->
<template>
  <div class="room-card" @click="handleViewDetail">
    <!-- 左侧图片 -->
    <div class="room-image">
      <el-image
        :src="room.graphVoList.length > 0 ? room.graphVoList[0]?.url : defaultImage"
        :alt="room.roomNumber"
        fit="cover"
        class="card-img"
      />
    </div>

    <!-- 右侧信息 -->
    <div class="room-info">
      <h3 class="room-title">
        {{ room.apartmentInfo.name }} {{ room.roomNumber }}
      </h3>

      <div class="room-address">
        <el-icon size="14"><Location /></el-icon>
        <span class="address-text">
          {{ room.apartmentInfo.districtName }} {{ room.apartmentInfo.addressDetail }}
        </span>
      </div>

      <div class="room-tags">
        <el-tag
          v-for="label in room.labelInfoList"
          :key="label.id"
          size="small"
          effect="light"
          class="tag-item"
        >
          {{ label.name }}
        </el-tag>
      </div>

      <div class="room-price">
        <span class="price">¥{{ room.rent }}</span>
        <span class="unit">/月</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Location } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { RoomInterface } from '@/api/search/types';

const props = defineProps<{
  room: RoomInterface;
}>();

const router = useRouter();
const defaultImage = 'https://cube.elemecdn.com/3/7c/3ea6beec6434fd973e462d55b9dbc2059.jpg';

const handleViewDetail = () => {
  // 确保跳转时传递有效的room.id
  if (!props.room?.id) {
    ElMessage.warning('房间信息不完整，无法查看详情');
    return;
  }
  // 修复：明确以params方式传递id
  router.push(`/room-detail/${props.room.id}`).catch(err => {
    if (!err.message.includes('Avoided redundant navigation')) {
      console.error('跳转房间详情失败', err);
      ElMessage.error('跳转失败，请稍后重试');
    }
  });
};
</script>

<style scoped>
/* 横向卡片布局 */
.room-card {
  display: flex;
  height: 120px; /* 固定卡片高度 */
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.room-card:active {
  transform: scale(0.98);
}

/* 左侧图片区域 */
.room-image {
  width: 120px; /* 固定图片宽度 */
  height: 100%;
  flex-shrink: 0; /* 防止图片被压缩 */
}
.card-img {
  width: 100%;
  height: 100%;
}

/* 右侧信息区域 */
.room-info {
  flex: 1; /* 占据剩余空间 */
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden; /* 防止内容溢出 */
}

.room-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.room-address {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
.address-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 4px;
}

.room-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
  max-height: 24px; /* 只显示一行标签 */
  overflow: hidden;
}
.tag-item {
  height: 18px;
  line-height: 18px;
  padding: 0 4px;
  font-size: 11px;
}

.room-price {
  display: flex;
  align-items: baseline;
  margin-top: auto; /* 推到最底部 */
}
.price {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}
.unit {
  font-size: 12px;
  color: #999;
  margin-left: 2px;
}
</style>