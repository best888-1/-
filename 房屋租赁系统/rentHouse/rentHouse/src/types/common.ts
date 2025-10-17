// 图片信息（跨模块复用，与后端GraphVo匹配）
export interface GraphVo {
  id: number;  // 图片ID
  name: string;// 图片名称（如"房间客厅图"）
  url: string; // 图片URL地址
}

// 标签信息（跨模块复用，与后端LabelInfo匹配）
export interface LabelInfo {
  id: number;  // 标签ID
  name: string;// 标签名称（如"近地铁"、"拎包入住"）
}