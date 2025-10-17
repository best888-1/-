<template>
  <div class="appointment-card" @click="goToDetail(appointment.id)">
    <div class="card-left">
      <img 
        :src="appointment.graphVoList[0]?.url || defaultImg" 
        :alt="appointment.apartmentName"
      >
    </div>
    <div class="card-right">
      <div class="card-header">
        <h3 class="apartment-name">{{ appointment.apartmentName }}</h3>
        <el-tag 
          :type="statusType" 
          size="small"
          :class="statusClass"
        >
          {{ statusText }}
        </el-tag>
      </div>
      <div class="card-body">
        <p class="appointment-time">
          <span class="time-label">预约时间：</span>
          {{ formatTime(appointment.appointmentTime) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  AppointmentStatus, 
  AppointmentStatusMap,
  APPOINTMENT_TIME_FORMAT
} from '@/enums/constEnums';
import type { AppointmentItem } from '@/api/appointment/types';

// 接收父组件传递的预约数据
const props = defineProps<{
  appointment: AppointmentItem;
}>();

// 默认图片
const defaultImg = 'https://picsum.photos/200/120';

// 格式化时间 - 使用枚举中定义的展示格式
const formatTime = (time: string) => {
  if (!time) return '';
  
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  // 使用枚举中定义的格式模板替换
  return APPOINTMENT_TIME_FORMAT.DISPLAY
    .replace('yyyy', year.toString())
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes);
};

// 状态文本 - 从枚举映射中获取
const statusText = computed(() => {
  return AppointmentStatusMap[props.appointment.appointmentStatus as keyof typeof AppointmentStatusMap] || '未知状态';
});

// 状态标签类型 - 根据状态值返回对应的element-plus标签类型
const statusType = computed(() => {
  switch (props.appointment.appointmentStatus) {
    case AppointmentStatus.PENDING:
      return 'warning'; // 待处理-警告色
    case AppointmentStatus.CONFIRMED:
      return 'success'; // 已确认-成功色
    case AppointmentStatus.CANCELED:
      return 'danger';  // 已取消-危险色
    default:
      return 'info';    // 未知状态-信息色
  }
});

// 状态标签额外样式
const statusClass = computed(() => {
  return `status-${props.appointment.appointmentStatus}`;
});

// 触发前往详情页事件
const emit = defineEmits(['goToDetail']);
const goToDetail = (id: number) => {
  emit('goToDetail', id);
};
</script>

<style scoped>
.appointment-card {
  display: flex;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.appointment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-left {
  width: 120px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  margin-right: 16px;
  flex-shrink: 0;
}

.card-left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.appointment-card:hover .card-left img {
  transform: scale(1.05);
}

.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0; /* 解决文本溢出问题 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.apartment-name {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-body {
  color: #606266;
}

.appointment-time {
  font-size: 0.875rem;
  margin: 0;
  display: flex;
  align-items: center;
}

.time-label {
  color: #909399;
  margin-right: 4px;
}

/* 状态标签的额外样式 */
.status-1 {
  /* 待处理状态的额外样式 */
}

.status-2 {
  /* 已确认状态的额外样式 */
}

.status-3 {
  /* 已取消状态的额外样式 */
}
</style>
