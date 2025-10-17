import type { ApartmentDetail } from '../apartment/type';
import type { GraphVo } from '@/types/common';
import type { AppointmentStatus } from '@/enums/constEnums';

// 预约表单基础数据（前端提交用）
export interface AppointmentFormBase {
  name: string;          // 联系人姓名（必传）
  phone: string;         // 联系人手机号（必传）
  appointmentTime: string;// 预约时间（格式：yyyy-MM-dd HH:mm:ss，必传）
  additionalInfo?: string;// 备注（可选，与文档字段对齐）
}

// 创建预约参数（与后端ViewAppointment对齐）
export interface CreateAppointmentParams extends AppointmentFormBase {
  id?: number;           // 主键（更新时必传）
  apartmentId: number;   // 预约公寓ID（必传）
  userId?: number;       // 用户ID（可选，后端通过token自动获取）
  appointmentStatus?: AppointmentStatus; // 预约状态（可选）
}

// 预约列表项（与后端AppointmentItemVo匹配）
export interface AppointmentItem {
  apartmentItemVo: any;
  status: any;
  apartmentId: any;
  id: number;            // 预约ID
  apartmentName: string; // 公寓名称
  graphVoList: GraphVo[];// 图片信息
  appointmentTime: string;// 预约时间（格式：yyyy-MM-dd HH:mm:ss）
  appointmentStatus: AppointmentStatus; // 预约状态
}

// 预约详情（与后端AppointmentDetailVo匹配）
export interface AppointmentDetail extends AppointmentItem {
  userId: number;        // 用户id
  phone: string;         // 联系人手机号
  apartmentId: number;   // 公寓id
  additionalInfo?: string;// 备注信息
  apartmentItemVo: ApartmentDetail; // 公寓完整信息
}