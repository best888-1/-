<template>
  <div class="apartment-detail-container">
    <!-- 顶部导航 -->
    <header class="detail-header">
      <el-icon @click="$router.back()" class="back-icon"><ArrowLeft /></el-icon>
      <span>公寓详情</span>
    </header>

    <!-- 加载状态 -->
    <el-loading v-if="loading" fullscreen text="正在加载公寓信息..." />

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <el-icon class="error-icon"><WarningFilled /></el-icon>
      <p class="error-message">{{ errorMessage }}</p>
      <el-button type="primary" @click="reloadData()">重新加载</el-button>
    </div>

    <!-- 内容区域 -->
    <template v-else-if="apartmentDetail.id">
      <!-- 公寓图片 -->
      <div class="apartment-images">
        <el-image 
          v-for="(img, index) in apartmentDetail.graphVoList" 
          :key="img.id || index" 
          :src="img.url" 
          :alt="apartmentDetail.name"
          fit="cover"
          class="apartment-image"
          fallback-src="https://picsum.photos/400/200?random=2"
        />
      </div>

      <!-- 公寓基本信息 -->
      <div class="apartment-basic">
        <h1 class="apartment-title">{{ apartmentDetail.name }}</h1>
        
        <!-- 地址信息 -->
        <div class="apartment-address">
          <el-icon size="14"><Location /></el-icon>
          <span>{{ apartmentDetail.districtName }} {{ apartmentDetail.addressDetail }}</span>
        </div>
        
        <!-- 租金范围 -->
        <div class="apartment-rent" v-if="apartmentDetail.minRent">
          <span class="price">¥{{ apartmentDetail.minRent.toLocaleString() }}</span>
          <span v-if="apartmentDetail.maxRent">- ¥{{ apartmentDetail.maxRent.toLocaleString() }}</span>
          <span class="unit">/月</span>
        </div>
        
        <!-- 标签 -->
        <div class="apartment-tags" v-if="apartmentDetail.labelInfoList && apartmentDetail.labelInfoList.length">
          <el-tag 
            v-for="label in apartmentDetail.labelInfoList" 
            :key="label.id" 
            size="small"
            class="apartment-tag"
          >
            {{ label.name }}
          </el-tag>
        </div>
      </div>

      <!-- 交通信息 -->
      <div class="apartment-traffic" v-if="apartmentDetail.trafficInfo">
        <h3 class="section-title">
          <el-icon size="16" class="section-icon"><MapLocation /></el-icon>
          交通信息
        </h3>
        <p class="traffic-content">{{ apartmentDetail.trafficInfo }}</p>
      </div>

      <!-- 配套设施 -->
      <div class="apartment-facilities">
        <h3 class="section-title">
          <el-icon size="16" class="section-icon"><HomeFilled /></el-icon>
          配套设施
        </h3>
        <div class="facility-grid">
          <div class="facility-item" v-for="facility in apartmentDetail.facilityInfoList" :key="facility.id">
            <el-icon v-if="facility.icon" class="facility-icon">
              <img :src="facility.icon" :alt="facility.name" />
            </el-icon>
            <el-icon v-else class="facility-icon"><HelpFilled /></el-icon>
            <span class="facility-name">{{ facility.name }}</span>
          </div>
        </div>
      </div>

      <!-- 公寓介绍 -->
      <div class="apartment-description" v-if="apartmentDetail.description">
        <h3 class="section-title">
          <el-icon size="16" class="section-icon"><Document /></el-icon>
          公寓介绍
        </h3>
        <p class="description-content">{{ apartmentDetail.description }}</p>
      </div>

      <!-- 可选房间列表 -->
      <div class="room-list-section">
        <h3 class="section-title">
          <el-icon size="16" class="section-icon"><House /></el-icon>
          可选房间
        </h3>
        
        <!-- 房间列表 -->
        <div class="room-list" v-if="roomList.length">
          <RoomCard 
            v-for="room in roomList" 
            :key="room.id" 
            :room="room" 
            @click="toRoomDetail(room.id)"
          />
        </div>
        
        <!-- 空状态 -->
        <div class="empty-room" v-else>
          <el-empty description="暂无可用房间" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ArrowLeft, 
  Location, 
  WarningFilled,
  MapLocation,
  HomeFilled,
  Document,
  House,
  HelpFilled
} from '@element-plus/icons-vue';
import { ElMessage, ElEmpty } from 'element-plus';
import { 
  getApartmentDetail,
  getApartmentLabels,
  getApartmentImages
} from '@/api/apartment';
import { getRoomsByApartmentId } from '@/api/room';
import { ItemType } from '@/enums/constEnums';
import type { ApartmentDetailVo } from '@/api/apartment/type';
import type { RoomItem } from '@/api/room/types';
import RoomCard from '@/components/search/RoomCard.vue';

// 路由相关
const route = useRoute();
const router = useRouter();
const apartmentId = Number(route.params.id);

// 状态管理
const apartmentDetail = ref<ApartmentDetailVo>({} as ApartmentDetailVo);
const roomList = ref<RoomItem[]>([]);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');

// 重新加载数据
const reloadData = () => {
  loading.value = true;
  error.value = false;
  fetchData();
};

// 获取公寓详情数据
const fetchApartmentDetail = async () => {
  try {
    if (isNaN(apartmentId)) throw new Error('无效的公寓ID');
    
    // 获取公寓基本信息
    const detailRes = await getApartmentDetail(apartmentId);
    if (!detailRes.data?.id) throw new Error('未找到公寓信息');
    apartmentDetail.value = detailRes.data;
    
   
    // // 获取图片列表
    // const imagesRes = await getApartmentImages(apartmentId);
    // if (imagesRes.data && imagesRes.data.length) {
    //   apartmentDetail.value.graphVoList = imagesRes.data;
    // }
  } catch (err) {
    console.error('获取公寓详情失败', err);
    throw err instanceof Error ? err : new Error('获取公寓信息失败');
  }
};

// 获取公寓下的房间列表
const fetchRoomList = async () => {
  try {
    if (isNaN(apartmentId)) return;
    
    const res = await getRoomsByApartmentId(apartmentId);
    roomList.value = res.data?.records || [];
  } catch (error) {
    console.error('获取房间列表失败', error);
    ElMessage.warning('获取房间列表失败，部分功能可能受限');
  }
};

// 统一数据获取
const fetchData = async () => {
  try {
    await Promise.all([
      fetchApartmentDetail(),
      fetchRoomList()
    ]);
  } catch (err) {
    error.value = true;
    errorMessage.value = err instanceof Error ? err.message : '加载失败，请重试';
  } finally {
    loading.value = false;
  }
};

// 跳转到房间详情页
const toRoomDetail = (roomId: number) => {
  if (!roomId) {
    ElMessage.warning('房间ID不存在');
    return;
  }
  router.push(`/room-detail/${roomId}`).catch(err => {
    if (!err.message.includes('Avoided redundant navigation')) {
      console.error('跳转房间详情失败', err);
      ElMessage.error('跳转失败，请稍后重试');
    }
  });
};

// 页面挂载时加载数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.apartment-detail-container {
  padding-bottom: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 头部导航 */
.detail-header {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-icon {
  margin-right: 12px;
  cursor: pointer;
  font-size: 20px;
}

/* 图片区域 */
.apartment-images {
  width: 100%;
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.apartment-images::-webkit-scrollbar {
  display: none;
}

.apartment-image {
  width: 100%;
  height: 220px;
  flex-shrink: 0;
}

/* 基本信息 */
.apartment-basic {
  padding: 16px;
  background: #fff;
  margin-bottom: 10px;
}

.apartment-title {
  font-size: 18px;
  margin: 0 0 12px 0;
  color: #303133;
}

.apartment-address {
  display: flex;
  align-items: center;
  color: #606266;
  margin-bottom: 10px;
  font-size: 14px;
}

.apartment-rent {
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
}

.unit {
  color: #606266;
  margin-left: 4px;
}

.apartment-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.apartment-tag {
  background-color: #f0f9eb;
  color: #52c41a;
  border-color: #b7eb8f;
}

/* 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  color: #faad14;
  margin-bottom: 16px;
}

.error-message {
  color: #606266;
  margin-bottom: 24px;
  font-size: 16px;
}

/* 通用区域样式 */
.section-title {
  font-size: 16px;
  color: #303133;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.section-icon {
  margin-right: 8px;
  color: #409eff;
}

/* 交通信息 */
.apartment-traffic {
  padding: 16px;
  background: #fff;
  margin-bottom: 10px;
}

.traffic-content {
  color: #606266;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

/* 配套设施 */
.apartment-facilities {
  padding: 16px;
  background: #fff;
  margin-bottom: 10px;
}

.facility-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
}

.facility-item {
  display: flex;
  align-items: center;
  width: calc(33.333% - 16px);
  font-size: 14px;
}

.facility-icon {
  margin-right: 6px;
  width: 18px;
  height: 18px;
  color: #606266;
}

.facility-name {
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 公寓介绍 */
.apartment-description {
  padding: 16px;
  background: #fff;
  margin-bottom: 10px;
}

.description-content {
  color: #606266;
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
}

/* 房间列表区域 */
.room-list-section {
  padding: 16px;
  background: #fff;
  margin-bottom: 10px;
}

.room-list {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-room {
  padding: 30px 0;
  text-align: center;
}

/* 适配小屏设备 */
@media (max-width: 320px) {
  .apartment-image {
    height: 180px;
  }
  
  .facility-item {
    width: calc(50% - 16px);
  }
}

/* 适配iPhone X及以上刘海屏 */
@media (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3),
       (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
  .detail-header {
    padding-top: 10px;
    height: 60px;
  }
}
</style>