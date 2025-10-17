<template>
  <div class="time-picker-container">
    <el-form-item label="选择日期" prop="date">
      <el-date-picker
        v-model="selectedDate"
        type="date"
        placeholder="选择日期"
        :min-date="minDate"
        @change="handleDateChange"
        class="date-picker"
      />
    </el-form-item>

    <el-form-item label="可选时段" prop="timeSlot" v-if="availableTimeSlots.length > 0">
      <el-radio-group v-model="selectedTimeSlot" class="time-slot-group">
        <el-radio-button 
          v-for="slot in availableTimeSlots" 
          :key="slot" 
          :label="slot"
          class="time-slot-button"
        >
          {{ slot }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>

    <div v-else-if="selectedDate" class="no-time-slots">
      该日期暂无可用时段，请选择其他日期
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { APPOINTMENT_TIME_SLOTS } from '@/enums/constEnums';

// 格式化日期为 yyyy-MM-dd
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 组件属性（添加默认值避免undefined）
const props = defineProps<{
  modelValue?: string; // 格式: yyyy-MM-dd HH:mm:ss
  apartmentId?: number;
}>();

// 事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

// 基础数据（初始化避免undefined）
const minDate = ref<Date>(new Date());
const selectedDate = ref<Date | null>(null);
const selectedTimeSlot = ref<string>(''); // 确保初始值为字符串而非undefined
const availableTimeSlots = ref<string[]>(APPOINTMENT_TIME_SLOTS);

// 初始化（修复类型错误：处理可能的undefined）
if (props.modelValue) {
  const [dateStr, timeStr] = props.modelValue.split(' ');
  if (dateStr) {
    selectedDate.value = new Date(dateStr);
  }
  // 从时间字符串反推选中的时段
  if (timeStr) {
    const hour = timeStr.split(':')[0];
    selectedTimeSlot.value = APPOINTMENT_TIME_SLOTS.find(slot => 
      slot.startsWith(hour)
    ) || ''; // 找不到时用空字符串避免undefined
  } else {
    selectedTimeSlot.value = '';
  }
}

// 监听日期和时段变化，更新绑定值（确保类型安全）
watch([() => selectedDate.value, () => selectedTimeSlot.value], () => {
  updateModelValue();
});

// 处理日期变更
const handleDateChange = (date: Date | null) => {
  if (date) {
    // 实际项目中这里应该调用接口查询该日期的可用时段
    availableTimeSlots.value = APPOINTMENT_TIME_SLOTS;
    selectedTimeSlot.value = ''; // 重置为字符串
  } else {
    availableTimeSlots.value = [];
    selectedTimeSlot.value = '';
  }
  updateModelValue();
};

// 更新绑定值（确保返回字符串）
const updateModelValue = () => {
  if (selectedDate.value && selectedTimeSlot.value) {
    const dateStr = formatDate(selectedDate.value);
    const [startTime] = selectedTimeSlot.value.split('-');
    emit('update:modelValue', `${dateStr} ${startTime}:00`);
  } else {
    emit('update:modelValue', ''); // 用空字符串而非undefined
  }
};
</script>

<style scoped>
.time-picker-container {
  width: 100%;
}

.date-picker {
  width: 100%;
}

.time-slot-group {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.time-slot-button {
  flex: 1;
  min-width: 100px;
}

.no-time-slots {
  color: #f56c6c;
  padding: 12px 0 0 100px;
  font-size: 14px;
}

@media (max-width: 320px) {
  .time-slot-button {
    min-width: 80px;
  }
  
  .no-time-slots {
    padding-left: 80px;
  }
}
</style>