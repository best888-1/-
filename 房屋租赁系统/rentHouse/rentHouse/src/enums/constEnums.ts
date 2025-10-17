/** 1. 预约相关枚举 */
/** 1. 预约相关枚举 */
// 预约状态枚举（与后端可用值1,2,3对齐）
export enum AppointmentStatus {
  PENDING = '1',    // 待处理
  CONFIRMED = '2',  // 已确认
  CANCELED = '3'    // 已取消
  // 文档中未明确"已完成"状态码，若存在需补充
}

// 预约状态文本映射（前端展示用）
export const AppointmentStatusMap = {
  [AppointmentStatus.PENDING]: '待处理',
  [AppointmentStatus.CONFIRMED]: '已确认',
  [AppointmentStatus.CANCELED]: '已取消'
};

// 预约时间格式（与后端序列化格式对齐）
export const APPOINTMENT_TIME_FORMAT = {
  REQUEST: 'yyyy-MM-dd HH:mm:ss', // 前端提交格式（文档要求）
  DISPLAY: 'yyyy年MM月dd日 HH:mm',// 前端展示格式
  DATE_ONLY: 'yyyy年MM月dd日',    // 仅展示日期
  TIME_ONLY: 'HH:mm'              // 仅展示时间
};

// 预约时间段选项（前端时间选择器下拉选项）
export const APPOINTMENT_TIME_SLOTS = [
  '09:00-11:00',
  '11:00-13:00',
  '13:00-15:00',
  '15:00-17:00',
  '17:00-19:00'
];
//** 2. 租约相关枚举 */
// 租约状态枚举（与后端可用值1,2,3,4,5,6,7对齐）
export enum LeaseStatus {
  PENDING = '1',       // 待生效（示例映射，需与后端实际定义对应）
  ACTIVE = '2',        // 生效中
  EXPIRED = '3',       // 已过期
  TERMINATED = '4',    // 已解除
  // 补充文档中剩余的状态值（根据实际业务含义定义）
  CONFIRMED = '5',     // 已确认（示例）
  REJECTED = '6',      // 已拒绝（示例）
  CANCELED = '7'       // 已取消（示例）
}

// 租约状态文本映射
export const LeaseStatusMap = {
  [LeaseStatus.PENDING]: '待生效',
  [LeaseStatus.ACTIVE]: '生效中',
  [LeaseStatus.EXPIRED]: '已过期',
  [LeaseStatus.TERMINATED]: '已解除',
  [LeaseStatus.CONFIRMED]: '已确认',
  [LeaseStatus.REJECTED]: '已拒绝',
  [LeaseStatus.CANCELED]: '已取消'
};

// 租约来源枚举（与后端可用值1,2对齐）
export enum LeaseSourceType {
  ONLINE = '1',  // 线上签约
  OFFLINE = '2'  // 线下签约
}

// 租约来源文本映射
export const LeaseSourceTypeMap = {
  [LeaseSourceType.ONLINE]: '线上签约',
  [LeaseSourceType.OFFLINE]: '线下签约'
};

/** 3. 房源发布状态枚举 */
// 发布状态（用于筛选"已发布"的有效房源，与后端ReleaseStatus对齐）
export enum ReleaseStatus {
  UNPUBLISHED = 0, // 未发布（草稿状态，不对外展示）
  PUBLISHED = 1,   // 已发布（正常展示，前端默认筛选）
  OFFLINE = 2      // 已下架（临时隐藏，不对外展示）
}

// 发布状态文本映射
export const ReleaseStatusMap = {
  [ReleaseStatus.UNPUBLISHED]: '未发布',
  [ReleaseStatus.PUBLISHED]: '已发布',
  [ReleaseStatus.OFFLINE]: '已下架'
};

/** 4. 物品类型枚举（用于图片/标签关联） */
// 物品类型（区分公寓/房间，与后端ItemType对齐）
export enum ItemType {
  APARTMENT = 1, // 公寓（如公寓图片、公寓标签）
  ROOM = 2       // 房间（如房间图片、房间标签）
}

// 物品类型文本映射
export const ItemTypeMap = {
  [ItemType.APARTMENT]: '公寓',
  [ItemType.ROOM]: '房间'
};
/** 2. 租约相关枚举 */
// 租约状态枚举（与后端LeaseStatus对齐）


// 租约操作类型枚举（用于日志/状态变更记录）
export enum LeaseOperateType {
  TERMINATE = 'TERMINATE', // 终止租约
  RENEW = 'RENEW',         // 续租申请
  FILE_DOWNLOAD = 'FILE_DOWNLOAD' // 下载租约文件
}