import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { createAppointment, cancelAppointment } from '@/api/appointment';
import type { CreateAppointmentParams } from '@/api/appointment/types';
import { useAppointmentStore } from '@/store/modules/appointment';
import { getAppointmentList } from '@/api/appointment';

export const useAppointment = () => {
  const loading = ref(false);
  const appointmentStore = useAppointmentStore();

  /**
   * 处理预约提交
   * @param params 预约表单参数
   * @returns 是否提交成功
   */
  const handleSubmitAppointment = async (params: CreateAppointmentParams): Promise<boolean> => {
    try {
      loading.value = true;
      await createAppointment(params);
      ElMessage.success('预约提交成功');
      // 重新获取预约列表并更新缓存
      const res = await getAppointmentList();
      appointmentStore.updateAppointmentList(res.data);
      return true;
    } catch (error) {
      ElMessage.error('预约提交失败，请重试');
      console.error('预约提交失败:', error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 取消预约
   * @param id 预约ID
   * @returns 是否取消成功
   */
  const handleCancelAppointment = async (id: number): Promise<boolean> => {
    try {
      loading.value = true;
      await cancelAppointment(id);
      ElMessage.success('预约已取消');
      // 重新获取预约列表并更新缓存
      const res = await getAppointmentList();
      appointmentStore.updateAppointmentList(res.data);
      return true;
    } catch (error) {
      ElMessage.error('取消预约失败，请重试');
      console.error('取消预约失败:', error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 格式化预约时间
   * @param time 原始时间字符串 (YYYY-MM-DD HH:MM:SS 或 YYYY-MM-DD HH:MM-HH:MM)
   * @returns 格式化后的时间字符串
   */
  const formatAppointmentTime = (time: string): string => {
    if (!time) return '';
    
    // 处理包含时间段的格式 (YYYY-MM-DD HH:MM-HH:MM)
    if (time.includes('-', 16)) {
      const [datePart, timePart] = time.split(' ');
      const [startTime, endTime] = timePart.split('-');
      return `${formatDate(datePart)} ${startTime.slice(0, 5)}-${endTime.slice(0, 5)}`;
    }
    
    // 处理标准时间格式 (YYYY-MM-DD HH:MM:SS)
    const [datePart, timePart] = time.split(' ');
    return `${formatDate(datePart)} ${timePart.slice(0, 5)}`;
  };

  /**
   * 格式化日期
   * @param date 日期字符串 (YYYY-MM-DD)
   * @returns 格式化后的日期 (MM月DD日 星期X)
   */
  const formatDate = (date: string): string => {
    const dateObj = new Date(date);
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const weekDay = weekDays[dateObj.getDay()];
    return `${month}月${day}日 星期${weekDay}`;
  };

  return {
    loading,
    handleSubmitAppointment,
    handleCancelAppointment,
    formatAppointmentTime,
    formatDate
  };
};