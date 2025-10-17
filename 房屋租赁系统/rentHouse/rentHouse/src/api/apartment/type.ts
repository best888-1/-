import type { GraphVo, LabelInfo } from '@/types/common'; // 复用公共类型

// 公寓公共配套设施（与后端FacilityInfo匹配）
export interface ApartmentFacility {
  id: number;          // 设施ID
  name: string;        // 设施名称（如"健身房"、"停车场"）
  icon?: string;       // 设施图标URL（可选）
}

// 公寓列表项（与后端ApartmentItemVo匹配）
export interface ApartmentItem {
  id: number;            // 公寓ID
  name: string;          // 公寓名称
  districtName: string;  // 所在区县（如"海淀区"）
  addressDetail: string; // 详细地址（如"中关村大街1号"）
  minRent: number;       // 公寓最低租金（元）
  graphVoList?: GraphVo[];// 公寓图片列表（可选，列表页缩略图）
  labelInfoList?: LabelInfo[];// 公寓标签（如"品牌公寓"，可选）
}

// 公寓详情（继承列表项，补充详情字段，与后端ApartmentDetailVo匹配）
export interface ApartmentDetail extends ApartmentItem {
  facilityInfoList: ApartmentFacility[]; // 公共配套设施
  description?: string;                  // 公寓介绍（可选）
  maxRent?: number;                      // 公寓最高租金（元，可选）
  trafficInfo?: string;                  // 交通信息（如"距2号线500米"，可选）
}

// 导出别名，兼容房间模块依赖
export type ApartmentDetailVo = ApartmentDetail;