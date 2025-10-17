// 通用接口响应类型，适用于所有后端接口
export interface ApiResponse<T = any> {
  code: number;       // 状态码（200表示成功）
  message: string;    // 接口提示信息
  data: T;            // 接口返回的核心数据（泛型参数，根据接口动态指定）
}

// 通用分页结果类型（匹配后端IPage结构）
export interface PageResult<T> {
  records: T[];       // 当前页数据列表
  total: number;      // 总数据量
  size: number;       // 每页条数
  current: number;    // 当前页码
  pages: number;      // 总页数
  searchCount?: boolean; // 是否计算总条数（默认true）
  optimizeCountSql?: boolean; // 是否优化计数SQL（默认true）
  hitCount?: boolean; // 是否命中count缓存（默认false）
}