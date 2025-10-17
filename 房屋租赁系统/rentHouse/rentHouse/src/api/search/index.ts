import http from '@/utils/http';
import type {
  RoomListQueryInterface,
  RoomListResponse,
  RegionInterface,
  PaymentTypeInterface,
} from './types';

/**
 * 获取房源列表（分页）
 * @param params 查询参数
 * @returns Promise<RoomListResponse>
 */
export const getRoomList = (params: RoomListQueryInterface): Promise<RoomListResponse> => {
  // 关键修复：将参数放在 config 的 params 中，符合 axios 规范
  return http.get('/app/room/pageItem', { params });
};

/**
 * 获取省份列表
 * @returns Promise<ApiResponse<RegionInterface[]>>
 */
export const getProvinceList = (): Promise<{ data: RegionInterface[] }> => {
  return http.get('/app/region/province/list');
};

/**
 * 根据省份ID获取城市列表
 * @param provinceId 省份ID
 * @returns Promise<ApiResponse<RegionInterface[]>>
 */
export const getCityListByProvinceId = (provinceId: number): Promise<{ data: RegionInterface[] }> => {
  // 修复：参数放在 params 中
  return http.get('/app/region/city/listByProvinceId', { params: { id: provinceId } });
};

/**
 * 根据城市ID获取区县列表
 * @param cityId 城市ID
 * @returns Promise<ApiResponse<RegionInterface[]>>
 */
export const getDistrictListByCityId = (cityId: number): Promise<{ data: RegionInterface[] }> => {
  // 修复：参数放在 params 中
  return http.get('/app/region/district/listByCityId', { params: { id: cityId } });
};

/**
 * 获取支付方式列表
 * @returns Promise<ApiResponse<PaymentTypeInterface[]>>
 */
export const getPaymentTypeList = (): Promise<{ data: PaymentTypeInterface[] }> => {
  return http.get('/app/payment/list');
};
