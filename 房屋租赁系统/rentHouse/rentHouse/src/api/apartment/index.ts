import http from '@/utils/http';
import type { ApiResponse } from '@/types/api';
import type {
  ApartmentDetail,
  ApartmentFacility,
} from './type';
import type { GraphVo, LabelInfo } from '@/types/common';
/** 获取公寓详情（后端路径：/app/apartment/getDetailById） */
export const getApartmentDetail = (id: number): Promise<ApiResponse<ApartmentDetail>> => {
  return http.get('/app/apartment/getDetailById', { params: { id } });
};

/** 获取公寓标签列表（后端路径：/app/apartment/getLabelList） */
export const getApartmentLabels = (apartmentId: number): Promise<ApiResponse<LabelInfo[]>> => {
  return http.get('/app/apartment/getLabelList', { params: { id: apartmentId } });
};

/** 获取公寓图片列表（后端路径：/app/apartment/getGraphList） */
export const getApartmentImages = (apartmentId: number): Promise<ApiResponse<GraphVo[]>> => {
  return http.get('/app/apartment/getGraphList', { params: { id: apartmentId } });
};