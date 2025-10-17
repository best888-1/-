<template>
  <div class="lease-detail-page">
    <div class="page-header">
      <el-button 
        type="text" 
        icon="ArrowLeft" 
        @click="$router.back()"
      ></el-button>
      <h1>租约详情</h1>
    </div>

    <div v-if="loading" class="loading-state">
      <el-loading-spinner />
    </div>

    <div v-else class="detail-content">
      <!-- 签约公寓 -->
      <div class="apartment-section">
        <h2 class="section-title">签约公寓</h2>
        <div class="apartment-card">
          <img 
            :src="leaseDetail?.apartmentGraphVoList[0]?.url || defaultImg" 
            :alt="leaseDetail?.apartmentName"
          >
          <h3>{{ leaseDetail?.apartmentName }}</h3>
        </div>
      </div>

      <!-- 签约房间 -->
      <div class="room-section">
        <h2 class="section-title">签约房间</h2>
        <div class="room-card">
          <img 
            :src="leaseDetail?.roomGraphVoList[0]?.url || defaultImg" 
            :alt="`${leaseDetail?.apartmentName}${leaseDetail?.roomNumber}`"
          >
          <h3>{{ leaseDetail?.roomNumber }}</h3>
        </div>
      </div>

      <!-- 承租人信息 -->
      <div class="lessee-section">
        <h2 class="section-title">承租人信息</h2>
        <div class="info-card">
          <div class="info-item">
            <span class="label">姓名</span>
            <span class="value">{{ leaseDetail?.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">手机号</span>
            <span class="value">{{ leaseDetail?.phone }}</span>
          </div>
          <div class="info-item">
            <span class="label">身份证号</span>
            <span class="value">{{ leaseDetail?.identificationNumber }}</span>
          </div>
        </div>
      </div>

      <!-- 租约详情 -->
      <div class="lease-info-section">
        <h2 class="section-title">租约详情</h2>
        <div class="info-card">
          <div class="info-item">
            <span class="label">租期</span>
            <span class="value">{{ leaseDetail?.leaseTermMonthCount }}月</span>
          </div>
          <div class="info-item">
            <span class="label">合同租期</span>
            <span class="value">{{ formatDate(leaseDetail?.leaseStartDate) }} 至 {{ formatDate(leaseDetail?.leaseEndDate) }}</span>
          </div>
          <div class="info-item">
            <span class="label">租金</span>
            <span class="value">{{ leaseDetail?.rent }}元/月</span>
          </div>
          <div class="info-item">
            <span class="label">押金(元)</span>
            <span class="value">{{ leaseDetail?.deposit }}</span>
          </div>
          <div class="info-item">
            <span class="label">支付方式</span>
            <span class="value">{{ leaseDetail?.paymentTypeName }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-section" v-if="leaseDetail?.status === LeaseStatus.CONFIRMED">
        <el-button type="primary" @click="handleConfirmRenew">确认续约</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getLeaseDetail } from '@/api/lease';
import { LeaseStatus } from '@/enums/constEnums';
import { ElButton, ElMessage } from 'element-plus';
import type { LeaseDetail } from '@/api/lease/type';

const leaseDetail = ref<LeaseDetail | null>(null);
const loading = ref(true);
const defaultImg = 'https://picsum.photos/200/200';
const route = useRoute();
const router = useRouter();

// 获取租约详情
const fetchLeaseDetail = async () => {
  try {
    const id = Number(route.params.id);
    loading.value = true;
    const res = await getLeaseDetail(id);
    leaseDetail.value = res.data;
  } catch (error) {
    ElMessage.error('获取租约详情失败');
  } finally {
    loading.value = false;
  }
};

// 确认续约
const handleConfirmRenew = () => {
  ElMessage.success('续约操作已确认');
  // 实际场景中可调用续约接口，此处仅为示例
  router.push('/my-lease');
};

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

onMounted(() => {
  fetchLeaseDetail();
});
</script>

<style scoped>
.lease-detail-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0 0 0 10px;
  font-size: 1.5rem;
}

.loading-state {
  text-align: center;
  padding: 100px 0;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #f5f5f5;
}

.apartment-card, .room-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.apartment-card img, .room-card img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 16px;
}

.apartment-card h3, .room-card h3 {
  margin: 0;
  font-size: 1rem;
}

.info-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  color: #606266;
  font-size: 0.9rem;
}

.value {
  font-size: 1rem;
}

.action-section {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>