import http from '@/utils/http';
import type { ApiResponse } from '@/types/api';
import type {
  LeaseListItem,
  LeaseDetail,
  LeasePageResult,
  LeaseOperateParams,
  LeaseSaveParams
} from './type';

/** 1. 获取租约列表（文档路径：/app/agreement/listItem，无分页参数） */
export const getLeaseList = (): Promise<ApiResponse<LeasePageResult>> => {
  return http.get('/app/agreement/listItem');
};

/** 2. 获取租约详情（文档路径：/app/agreement/getDetailById） */
export const getLeaseDetail = (leaseId: number): Promise<ApiResponse<LeaseDetail>> => {
  return http.get('/app/agreement/getDetailById', {
    params: { id: leaseId }
  });
};

/** 3. 更新租约状态（文档路径：/app/agreement/updateStatusById，支持终止等操作） */
export const updateLeaseStatus = (params: {
  id: number;
  leaseStatus: string;
}): Promise<ApiResponse<null>> => {
  return http.post('/app/agreement/updateStatusById', null, { params });
};

/** 4. 保存或更新租约（文档路径：/app/agreement/saveOrUpdate，支持续约） */
export const saveOrUpdateLease = (data: LeaseSaveParams): Promise<ApiResponse<null>> => {
  return http.post('/app/agreement/saveOrUpdate', data);
};

export const getPaymentMethodList = (roomId: number): Promise<ApiResponse<any[]>> => {
  return http.get('/app/payment/listByRoomId', { params: { roomId } });
};

/** 根据房间ID查询可选租期列表 */
export const getLeaseTermList = (roomId: number): Promise<ApiResponse<any[]>> => {
  return http.get('/app/term/listByRoomId', { params: { roomId } });
};