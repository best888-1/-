import http from '@/utils/http';
import type { ApiResponse } from '@/types/api';
import type {
  CreateAppointmentParams,
  AppointmentItem,
  AppointmentDetail
} from './types';

/** 创建/更新预约（后端路径：/app/appointment/saveOrUpdate） */
export const createOrUpdateAppointment = (
  data: CreateAppointmentParams
): Promise<ApiResponse<null>> => {
  return http.post('/app/appointment/saveOrUpdate', data);
};

/** 获取当前用户预约列表（后端路径：/app/appointment/listItem） */
export const getAppointmentList = (): Promise<ApiResponse<AppointmentItem[]>> => {
  return http.get('/app/appointment/listItem');
};

/** 获取预约详情（后端路径：/app/appointment/getDetailById） */
export const getAppointmentDetail = (id: number): Promise<ApiResponse<AppointmentDetail>> => {
  return http.get('/app/appointment/getDetailById', { params: { id } });
};

