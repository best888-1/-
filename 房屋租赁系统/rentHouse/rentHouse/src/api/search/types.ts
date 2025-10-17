import type { PageResult } from "@/types/api";

// 图片信息接口
export interface GraphVo {
  name: string;
  url: string;
}

// 定义房间查询参数接口
export interface RoomListQueryInterface {
  provinceId?: number;
  cityId?: number;
  districtId?: number;
  minRent?: number;
  maxRent?: number;
  paymentTypeId?: number;
  orderType?: 'asc' | 'desc';
  current: number;
  size: number;
}

// 定义单个房源信息接口
export interface RoomInterface {
  id: number;
  roomNumber: string;
  rent: number;
  graphVoList: GraphVo[];
  labelInfoList: {
    id: number;
    name: string;
  }[];
  apartmentInfo: {
    id: number;
    name: string;
    districtName: string;
    addressDetail: string;
  };
}

// 定义API通用响应接口（如果已在api.ts中定义可删除）
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 定义地区信息接口
export interface RegionInterface {
  id: number;
  name: string;
  parentId?: number;
  children?: RegionInterface[];
}

// 定义支付方式接口
export interface PaymentTypeInterface {
  id: number;
  name: string;
}

// 定义具体的API响应类型
export type RoomListResponse = ApiResponse<PageResult<RoomInterface>>;
export type RegionListResponse = ApiResponse<RegionInterface[]>;
export type PaymentTypeListResponse = ApiResponse<PaymentTypeInterface[]>;