import http from '@/utils/http';
import type { ApiResponse } from '@/types/api';
import type {
  RoomDetail,
  RoomItem,
  RoomPageResult,
  RoomFacility
} from './types';

/** 获取房间详情（后端路径：/app/room/getDetailById） */
export const getRoomDetail = (id: number): Promise<ApiResponse<RoomDetail>> => {
  return http.get('/app/room/getDetailById', { params: { id } });
};

/** 根据公寓ID获取房间列表（分页，后端路径：/app/room/pageItemByApartmentId） */
export const getRoomsByApartmentId = (
  apartmentId: number,
  current = 1,
  size = 10
): Promise<ApiResponse<RoomPageResult>> => {
  return http.get('/app/room/pageItemByApartmentId', {
    params: { id: apartmentId, current, size } // 参数"id"对应后端公寓ID
  });
};

/** 获取房间配套设施列表（后端路径：/app/room/getFacilityList） */
export const getRoomFacilities = (roomId: number): Promise<ApiResponse<RoomFacility[]>> => {
  return http.get('/app/room/getFacilityList', { params: { id: roomId } });
};