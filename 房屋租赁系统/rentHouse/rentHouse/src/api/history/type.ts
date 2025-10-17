import type { PageResult } from "@/types/api";
import type { GraphVo } from '@/types/common'; // 引入通用图片类型

// 浏览历史项（与后端HistoryItemVo完全匹配）
export interface BrowsingHistoryItem {
  id: number;            // 主键
  userId: number;        // 用户id
  roomId: number;        // 房间id
  browseTime: string;    // 浏览时间（格式：date-time）
  roomNumber: string;    // 房间号
  rent: number;          // 租金
  roomGraphVoList: GraphVo[]; // 房间图片信息
  apartmentName: string; // 公寓名称
  provinceName: string;  // 省份名称
  cityName: string;      // 城市名称
  districtName: string;  // 区县名称
}

export interface BrowsingHistoryPageResponse extends PageResult<BrowsingHistoryItem> {
  // 移除pages的重新定义，直接使用PageResult中的定义
  // 或明确设置为必填项（根据后端实际返回情况）
  pages: number;         // 总页数（必填，与PageResult保持一致）
}