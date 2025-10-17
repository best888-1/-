import type { PageResult } from '@/types/api';
import type { GraphVo } from '../../types/common';
import type { LeaseStatus, LeaseSourceType } from '@/enums/constEnums';

/** 租约列表项（与后端AgreementItemVo匹配） */
export interface LeaseListItem {
  id: number;                // 租约id
  roomGraphVoList: GraphVo[]; // 房间图片信息
  apartmentName: string;     // 公寓名称
  roomNumber: string;        // 房间号
  leaseStatus: LeaseStatus;  // 租约状态
  leaseStartDate: string;    // 租约开始日期
  leaseEndDate: string;      // 租约结束日期
  sourceType: LeaseSourceType; // 租约来源
  rent: number;              // 租金
}

/** 租约详情（与后端AgreementDetailVo匹配） */
export interface LeaseDetail {
  id: number;                  // 主键
  phone: string;               // 承租人手机号码
  name: string;                // 承租人姓名
  identificationNumber: string; // 承租人身份证号码
  apartmentId: number;         // 签约公寓id
  roomId: number;              // 签约房间id
  leaseStartDate: string;      // 租约开始日期
  leaseEndDate: string;        // 租约结束日期
  leaseTermId: number;         // 租期id
  rent: number;                // 租金（元/月）
  deposit: number;             // 押金（元）
  paymentTypeId: number;       // 支付类型id
  status: LeaseStatus;         // 租约状态
  sourceType: LeaseSourceType; // 租约来源
  additionalInfo?: string;     // 备注信息
  apartmentName: string;       // 公寓名称
  apartmentGraphVoList: GraphVo[]; // 公寓图片信息
  roomNumber: string;          // 房间号
  roomGraphVoList: GraphVo[];  // 房间图片信息
  paymentTypeName: string;     // 支付方式
  leaseTermMonthCount: number; // 租期月数
  leaseTermUnit: string;       // 租期单位
}

/** 租约分页结果（文档中列表接口无分页，暂保留兼容） */
export type LeasePageResult = PageResult<LeaseListItem>;

/** 租约操作参数（状态更新） */
export interface LeaseOperateParams {
  id: number;          // 租约ID
  leaseStatus: string; // 目标状态（枚举值）
}

/** 租约保存/更新参数（续约等场景） */
export interface LeaseSaveParams {
  id?: number;                 // 主键（更新时必填）
  phone?: string;              // 承租人手机号码
  name?: string;               // 承租人姓名
  identificationNumber?: string; // 承租人身份证号码
  apartmentId?: number;        // 签约公寓id
  roomId?: number;             // 签约房间id
  leaseStartDate?: string;     // 租约开始日期
  leaseEndDate?: string;       // 租约结束日期
  leaseTermId?: number;        // 租期id
  rent?: number;               // 租金（元/月）
  deposit?: number;            // 押金（元）
  paymentTypeId?: number;      // 支付类型id
  status?: string;             // 租约状态
  sourceType?: string;         // 租约来源
  additionalInfo?: string;     // 备注信息
}