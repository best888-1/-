import http from '@/utils/http';
import type { ApiResponse } from '@/types/api';
import type { 
  BrowsingHistoryPageResponse, 
  BrowsingHistoryItem 
} from './type';

/**
 * 获取浏览历史（分页）
 * @param current 当前页码（默认1）
 * @param size 每页条数（默认10）
 * @returns 分页的浏览历史列表
 */
export const getBrowsingHistory = (
  current = 1,
  size = 10
): Promise<ApiResponse<BrowsingHistoryPageResponse>> => {
  return http.get('/app/history/pageItem', {
    params: { current, size },
    showLoading: false
  });
};

/**
 * 保存浏览历史
 * @param roomId 房间ID
 * @returns 保存结果
 */
export const saveBrowsingHistory = (roomId: number): Promise<ApiResponse<null>> => {
  return http.post('/app/history/save', { roomId }, { showLoading: false });
};

/**
 * 删除浏览历史（文档未明确，但通常需要补充此接口）
 * @param id 历史记录ID
 * @returns 删除结果
 */
export const deleteBrowsingHistory = (id: number): Promise<ApiResponse<null>> => {
  return http.post('/app/history/delete', { id }, { showLoading: false });
};