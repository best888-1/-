<template>
  <div class="room-detail-container">
    <!-- 顶部导航 -->
    <header class="detail-header">
      <el-icon @click="$router.back()" class="back-icon"><ArrowLeft /></el-icon>
      <span>房间详情</span>
    </header>

    <!-- 加载状态 -->
    <el-loading v-if="loading" fullscreen text="正在加载房间详情..." />

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <el-icon class="error-icon"><WarningFilled /></el-icon>
      <p class="error-message">{{ errorMessage }}</p>
      <el-button type="primary" @click="getRoomInfo()">重新加载</el-button>
    </div>

    <!-- 内容区域 -->
    <template v-else-if="roomDetail.id">
      <!-- 房间图片 -->
      <div class="room-images">
        <el-image 
          v-for="(img, index) in roomDetail.graphVoList" 
          :key="img.id || index" 
          :src="img.url" 
          :alt="`${roomDetail.apartmentInfo?.name} ${roomDetail.roomNumber}`"
          fit="cover"
          class="room-image"
        />
      </div>

      <!-- 房间基本信息 -->
      <div class="room-basic">
        <h1 class="room-title">{{ roomDetail.apartmentInfo?.name }} {{ roomDetail.roomNumber }}</h1>
        <div class="room-price">
          <span class="price">¥{{ roomDetail.rent.toLocaleString() }}</span>
          <span class="unit">/月</span>
        </div>
        
        <!-- 标签 -->
        <div class="room-tags" v-if="roomDetail.labelInfoList && roomDetail.labelInfoList.length">
          <el-tag 
            v-for="label in roomDetail.labelInfoList" 
            :key="label.id" 
            size="small"
            class="room-tag"
          >
            {{ label.name }}
          </el-tag>
        </div>
      </div>

      <!-- 所属公寓卡 -->
      <div class="apartment-card" @click="toApartmentDetail(roomDetail.apartmentItemVo.id)">
        <h3 class="section-title">
          <el-icon size="16" class="section-icon"><HomeFilled /></el-icon>
          所属公寓
        </h3>
        <div class="apartment-info">
          <p class="apartment-name">{{ roomDetail.apartmentItemVo.name }}</p>
          <p class="apartment-address">
            <el-icon size="14"><Location /></el-icon>
            {{ roomDetail.apartmentItemVo.districtName }} {{ roomDetail.apartmentItemVo.addressDetail }}
          </p>
          <p class="apartment-rent">
            租金范围: ¥{{ roomDetail.apartmentItemVo.minRent.toLocaleString() }}
            <span v-if="roomDetail.apartmentItemVo.maxRent">- ¥{{ roomDetail.apartmentItemVo.maxRent.toLocaleString() }}</span> /月
          </p>
        </div>
        <el-icon class="arrow-icon"><ArrowRight /></el-icon>
      </div>

      <!-- 房间属性 -->
      <div class="room-attrs">
        <h3 class="section-title">
          <el-icon size="16" class="section-icon"><InfoFilled /></el-icon>
          房间属性
        </h3>
        <div class="attrs-grid">
          <div class="attr-item" v-for="attr in roomDetail.attrValueVoList" :key="attr.id">
            <span class="attr-name">{{ attr.name }}:</span>
            <span class="attr-value">{{ attr.value }}</span>
          </div>
        </div>
      </div>

      <!-- 配套设施 -->
      <div class="room-facilities">
        <h3 class="section-title">
          <el-icon size="16" class="section-icon"><Tools /></el-icon>
          配套设施
        </h3>
        <div class="facility-grid">
          <div class="facility-item" v-for="facility in roomDetail.facilityInfoList" :key="facility.id">
            <el-icon v-if="facility.icon" class="facility-icon">
              <img :src="facility.icon" :alt="facility.name" />
            </el-icon>
            <el-icon v-else class="facility-icon"><HelpFilled /></el-icon>
            <span class="facility-name">{{ facility.name }}</span>
          </div>
        </div>
      </div>

      <!-- 支付方式与租期 -->
      <div class="payment-lease">
        <div class="payment-types">
          <h3 class="section-title">
            <el-icon size="16" class="section-icon"><Money /></el-icon>
            支付方式
          </h3>
          <div class="payment-tags">
            <el-tag v-for="payment in roomDetail.paymentTypeList" :key="payment.id" size="small">{{ payment.name }}</el-tag>
          </div>
        </div>
        <div class="lease-terms">
          <h3 class="section-title">
            <el-icon size="16" class="section-icon"><Calendar /></el-icon>
            可租租期
          </h3>
          <div class="lease-tags">
            <el-tag v-for="term in roomDetail.leaseTermList" :key="term.id" size="small">{{ term.monthCount }}{{ term.unit }}</el-tag>
          </div>
        </div>
      </div>

      <!-- 费用说明 -->
      <div class="room-fees" v-if="roomDetail.feeValueVoList.length">
        <h3 class="section-title">
          <el-icon size="16" class="section-icon"><Document /></el-icon>
          费用说明
        </h3>
        <ul class="fee-list">
          <li v-for="fee in roomDetail.feeValueVoList" :key="fee.id">
            <span class="fee-name">{{ fee.name }}:</span>
            <span class="fee-value">{{ fee.value }}</span>
          </li>
        </ul>
      </div>

      <!-- 房间描述 -->
      <div class="room-description" v-if="roomDetail.description">
        <h3 class="section-title">
          <el-icon size="16" class="section-icon"><Document /></el-icon>
          房间描述
        </h3>
        <p class="description-content">{{ roomDetail.description }}</p>
      </div>

      <!-- 预约按钮 -->
      <div class="appointment-btn-container">
        <el-button 
          type="primary" 
          size="large" 
          class="appointment-btn"
          @click="toAppointment(roomDetail.id, roomDetail.apartmentItemVo.id)"
        >
          预约看房
        </el-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ArrowLeft, 
  WarningFilled, 
  HomeFilled, 
  Location, 
  InfoFilled, 
  Tools, 
  HelpFilled,
  Money,
  Calendar,
  Document,
  ArrowRight
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { getRoomDetail } from '@/api/room';
import type { RoomDetail } from '@/api/room/types';

// 路由相关
const route = useRoute();
const router = useRouter();
const roomId = Number(route.params.id);

// 房间详情数据
const roomDetail = ref<RoomDetail>({} as RoomDetail);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');

// 获取房间详情
const getRoomInfo = async () => {
  loading.value = true;
  error.value = false;
  try {
    if (isNaN(roomId)) {
      throw new Error('无效的房间ID');
    }
    
    const res = await getRoomDetail(roomId);
    if (res.data) {
      roomDetail.value = res.data;
    } else {
      throw new Error('未找到房间信息');
    }
  } catch (err) {
    console.error('获取房间详情失败:', err);
    error.value = true;
    errorMessage.value = err instanceof Error ? err.message : '加载房间信息失败';
  } finally {
    loading.value = false;
  }
};

// 跳转到公寓详情页
const toApartmentDetail = (apartmentId: number) => {
  if (apartmentId) {
    router.push(`/apartment-detail/${apartmentId}`).catch(err => {
      if (!err.message.includes('Avoided redundant navigation')) {
        console.error('跳转公寓详情失败', err);
        ElMessage.error('跳转失败，请稍后重试');
      }
    });
  }
};

// 跳转到预约页面：新增editMode=true参数，标记为编辑模式
const toAppointment = (roomId: number, apartmentId: number) => {
  router.push({
    path: '/my-appointment/detail/0', // 0占位表示新建
    query: { 
      apartmentId: apartmentId.toString(),
      editMode: 'true' // 新增参数：明确进入编辑模式
    }
  }).catch(err => {
    if (!err.message.includes('Avoided redundant navigation')) {
      console.error('跳转预约页面失败', err);
      ElMessage.error('跳转失败，请稍后重试');
    }
  });
};

// 页面挂载时获取数据
onMounted(() => {
  getRoomInfo();
});
</script>

<style scoped>
.room-detail-container {
  padding-bottom: 80px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.detail-header {
  padding: 16px 20px;
  background-color: #fff;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-icon {
  font-size: 20px;
  margin-right: 12px;
  cursor: pointer;
}

.room-images {
  display: flex;
  overflow-x: auto;
  width: 100%;
}

.room-image {
  width: 100%;
  height: 200px;
  flex-shrink: 0;
}

.room-basic {
  padding: 20px;
  background-color: #fff;
  margin-bottom: 10px;
}

.room-title {
  font-size: 18px;
  margin: 0 0 16px 0;
}

.room-price {
  color: #ff4d4f;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
}

.unit {
  font-size: 16px;
  margin-left: 4px;
}

.room-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.room-tag {
  background-color: #f0f9eb;
  color: #52c41a;
  border-color: #b7eb8f;
}

.apartment-card {
  padding: 16px;
  background-color: #fff;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.apartment-info {
  flex: 1;
}

.apartment-name {
  font-weight: bold;
  margin: 0 0 8px 0;
}

.apartment-address {
  color: #606266;
  font-size: 14px;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
}

.apartment-rent {
  color: #ff4d4f;
  font-size: 14px;
  margin: 0;
}

.arrow-icon {
  color: #c0c4cc;
}

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

.room-attrs, .room-facilities, .payment-lease, .room-fees, .room-description {
  padding: 16px;
  background-color: #fff;
  margin-bottom: 10px;
}

.attrs-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.attr-item {
  width: calc(50% - 16px);
  font-size: 14px;
}

.attr-name {
  color: #606266;
}

.attr-value {
  color: #303133;
  margin-left: 4px;
}

.facility-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
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

.payment-lease {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-tags, .lease-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.fee-list {
  margin: 0;
  padding-left: 20px;
}

.fee-list li {
  margin-bottom: 8px;
  font-size: 14px;
}

.fee-name {
  color: #606266;
  font-weight: 500;
}

.description-content {
  color: #606266;
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
}

.appointment-btn-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.appointment-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

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
  font-size: 16px;
  color: #8c8c8c;
  margin-bottom: 24px;
}

@media (max-width: 320px) {
  .facility-item, .attr-item {
    width: calc(50% - 16px);
  }
}
</style>