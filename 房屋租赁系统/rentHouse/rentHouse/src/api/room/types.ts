import type { PageResult } from '@/types/api';
import type { ApartmentDetailVo } from '../apartment/type';
import type { GraphVo, LabelInfo } from '@/types/common'; // 复用公共类型

// 租期信息（与后端LeaseTerm匹配）
export interface LeaseTerm {
  id: number;          // 租期ID
  monthCount: number;  // 租期月数（如12=1年）
  unit: string;        // 租期单位（如"月"、"年"）
}

// 房间属性（与后端AttrValueVo匹配）
export interface RoomAttr {
  id: number;          // 属性ID
  name: string;        // 属性名称（如"朝向"、"楼层"）
  value: string;       // 属性值（如"朝南"、"10层"）
}

// 房间费用说明（与后端FeeValueVo匹配）
export interface RoomFee {
  id: number;          // 费用ID
  name: string;        // 费用名称（如"物业费"、"水电费"）
  value: string;       // 费用说明（如"含物业费"、"水电费自理"）
}

// 房间配套设施（与后端FacilityInfo匹配）
export interface RoomFacility {
  id: number;          // 设施ID
  name: string;        // 设施名称（如"洗衣机"、"空调"）
  icon?: string;       // 设施图标URL（可选，前端展示用）
}

// 支付方式（复用，与后端PaymentType匹配）
export interface PaymentType {
  id: number;          // 支付方式ID
  name: string;        // 支付方式名称（如"押一付一"、"月付"）
}

// 房间列表项（与后端RoomItemVo对齐）
export interface RoomItem {
  id: number;            // 房间ID
  roomNumber: string;    // 房间编号（如"302室"）
  rent: number;          // 月租金（元）
  area?: number;         // 房间面积（㎡，可选）
  graphVoList: GraphVo[];// 房间图片列表
  labelInfoList: LabelInfo[];// 房间标签（如"近地铁"）
  apartmentInfo: {
    id: number;          // 所属公寓ID
    name: string;        // 公寓名称
    districtName: string;// 公寓所在区县（如"朝阳区"）
    addressDetail: string;// 公寓详细地址
  };
}

// 房间详情（继承列表项，补充详情字段，与后端RoomDetailVo匹配）
export interface RoomDetail extends RoomItem {
  apartmentItemVo: ApartmentDetailVo; // 所属公寓完整信息
  attrValueVoList: RoomAttr[];        // 房间属性列表
  facilityInfoList: RoomFacility[];   // 房间配套设施
  paymentTypeList: PaymentType[];     // 支持的支付方式
  feeValueVoList: RoomFee[];          // 费用说明列表
  leaseTermList: LeaseTerm[];         // 支持的租期列表
  description?: string;               // 房间描述（可选）
}

// 房间分页结果
export type RoomPageResult = PageResult<RoomItem>;