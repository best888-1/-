// src/enums/searchEnums.ts

/**
 * 房源排序类型枚举
 */
export enum SearchOrderType {
  DEFAULT = '',
  PRICE_ASC = 'asc', // 价格从低到高
  PRICE_DESC = 'desc', // 价格从高到低
}

/**
 * 预设价格范围枚举
 */
export enum PriceRange {
  ALL = 'all',
  R500 = '0-500',
  R1000 = '500-1000',
  R2000 = '1000-2000',
  R3000 = '2000-3000',
  R5000 = '3000-5000',
  R5000PLUS = '5000+',
}