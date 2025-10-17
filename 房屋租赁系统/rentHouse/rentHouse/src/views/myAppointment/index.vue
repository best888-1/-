<template>
  <!-- 模板部分保持不变 -->
  <div class="my-appointment-page">
    <div class="page-header">
      <el-button type="text" icon="ArrowLeft" @click="$router.back()"></el-button>
      <h1>我的预约</h1>
    </div>

    <div v-if="loading" class="loading-state">
      <el-loading-spinner />
    </div>

    <div v-else-if="!appointmentList || appointmentList.length === 0" class="empty-state">
      <Document style="font-size: 3rem; color: #ccc;" />
      <p>暂无预约记录</p>
      <el-button type="primary" @click="toCreateAppointment()">去预约</el-button>
    </div>

    <div v-else class="appointment-list">
      <AppointmentItemCard 
        v-for="item in appointmentList" 
        :key="item.id" 
        :appointment="item" 
        @goToDetail="goToAppointmentDetail" 
        @goToApartmentDetail="goToApartmentDetail" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAppointmentList } from '@/api/appointment';
import { ElMessage } from 'element-plus';
import { Document, ArrowLeft } from '@element-plus/icons-vue';
import AppointmentItemCard from '@/components/Appointment/AppointmentItemCard.vue';
import type { AppointmentItem } from '@/api/appointment/types';
// 导入枚举
import { AppointmentStatus, AppointmentStatusMap } from '@/enums/constEnums';
import type { GraphVo } from '@/types/common';

const appointmentList = ref<AppointmentItem[]>([]);
const loading = ref(true);
const router = useRouter();

// 修复核心：通过枚举值匹配转换状态，确保类型兼容
const formatAppointmentItem = (item: AppointmentItem): AppointmentItem => {
  // 1. 原始状态值
  const rawStatus = item.appointmentStatus;
  console.log('原始状态值：', rawStatus, '类型：', typeof rawStatus);

  // 2. 状态值转字符串（用于匹配枚举）
  const statusStr = String(rawStatus).trim();

  // 3. 关键：通过枚举值集合判断，确保类型为 AppointmentStatus
  const validStatus = Object.values(AppointmentStatus).includes(statusStr as AppointmentStatus)
    ? (statusStr as AppointmentStatus)  // 类型断言为枚举类型
    : AppointmentStatus.PENDING;        // 无效值默认待处理

  // 4. 返回完整类型的 AppointmentItem
  return {
    ...item,
    appointmentStatus: validStatus,  // 确保类型为枚举
    apartmentName: item.apartmentName || '未知公寓',
    apartmentId: item.apartmentId || item.apartmentItemVo?.id || 0,
    appointmentTime: item.appointmentTime 
      ? formatDateTime(item.appointmentTime) 
      : '未设置时间',
    graphVoList: item.graphVoList || ([] as GraphVo[]),  // 明确类型
   
  };
};

// 时间格式化
const formatDateTime = (timeStr: string) => {
  const date = new Date(timeStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 获取预约列表
const fetchAppointmentList = async () => {
  try {
    loading.value = true;
    const res = await getAppointmentList();
    if (res && Array.isArray(res.data)) {
      // 格式化每个项，确保类型正确
      appointmentList.value = res.data.map(item => formatAppointmentItem(item));
    } else {
      appointmentList.value = [];
      ElMessage.warning('接口返回数据格式异常');
    }
  } catch (error) {
    appointmentList.value = [];
    ElMessage.error('获取预约列表失败');
    console.error('接口调用失败：', error);
  } finally {
    loading.value = false;
  }
};

// 跳转逻辑保持不变
const goToAppointmentDetail = (appointmentId: number) => {
  if (!appointmentId || isNaN(appointmentId)) {
    ElMessage.error('无效的预约ID');
    return;
  }
  router.push(`/my-appointment/detail/${appointmentId}`).catch(err => {
    if (!err.message.includes('Avoided redundant navigation')) {
      console.error('跳转失败：', err);
      ElMessage.error('跳转失败，请稍后重试');
    }
  });
};

const goToApartmentDetail = (apartmentId: number) => {
  if (!apartmentId || isNaN(apartmentId)) {
    ElMessage.error('无效的公寓ID');
    return;
  }
  router.push(`/apartment-detail/${apartmentId}`).catch(err => {
    console.error('跳转失败：', err);
    ElMessage.error('跳转失败，请稍后重试');
  });
};

const toCreateAppointment = () => {
  router.push('/my-appointment/detail/0').catch(err => {
    console.error('跳转失败：', err);
    ElMessage.error('跳转失败，请稍后重试');
  });
};

onMounted(() => {
  fetchAppointmentList();
});
</script>

<style scoped>
/* 样式保持不变 */
</style>