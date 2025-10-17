// src/utils/http.ts
import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig
} from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import { removeToken } from '@/utils/token'; // 保留 removeToken
import router from '@/router';
import { useUserStore } from '@/store/modules/user'; // 引入 Pinia store



// 扩展Axios请求配置
export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  showLoading?: boolean; // 自定义属性
  ignoreAuth?: boolean;  // 自定义属性
}
// 基础响应类型
export interface Result {
  code: number;
  message: string;
  success?: boolean;
}

// 带数据的响应类型
export interface ResultData<T = any> extends Result {
  data: T;
}

// 创建Axios实例
const http = axios.create({
  baseURL: import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_BASE_URL
    : '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 加载实例
let loadingInstance: any = null;

// 请求拦截器
http.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig): InternalAxiosRequestConfig => {
    // 显示加载动画
    if (config.showLoading !== false) {
      loadingInstance = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }

    // 添加Token
    if (!config.ignoreAuth) {
      // 【推荐】从 Pinia store 中获取 token，而不是直接读取 localStorage
      const userStore = useUserStore();
      const token = userStore.token;

     if (token) {
  config.headers = {
  ...config.headers,
  'access-token': token
};
}
    }
    return config

    
  },
  (error: AxiosError) => {
    // 清除加载
    if (loadingInstance) loadingInstance.close();
    ElMessage.error('网络异常，请重试');
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse<ResultData>) => {
    // 清除加载
    if (loadingInstance) loadingInstance.close();

    const { code, message } = response.data;
    
    // 业务错误处理
    if (code !== 200) {
      // --- 开始修改 ---
      // 如果是 token 过期 (code=601)
      if (code === 601) {
        ElMessage.error('登录已过期，请重新登录');
        // 调用 Pinia store 中的 logout 方法来清除 token 和用户信息
        const userStore = useUserStore();
        userStore.logout(); 
        // 跳转到登录页，并携带当前页面路径以便重定向
        router.push(`/login?redirect=${router.currentRoute.value.fullPath}`);
      } else {
        // 对于其他业务错误，保持原有的提示逻辑
        ElMessage.error(message || '操作失败');
      }
      // --- 结束修改 ---

      // 返回一个被拒绝的Promise，让调用方可以捕获到错误
      return Promise.reject(new Error(message || 'Error'));
    }
    
    return response; // 返回完整的response对象
  },
  
  (error: AxiosError) => {
    // 清除加载
    if (loadingInstance) loadingInstance.close();

    // HTTP错误处理
    const status = error.response?.status;
    switch (status) {
      case 401:
        ElMessage.error('登录已过期，请重新登录');
        // 建议也统一使用 store 的 logout 方法
        const userStore = useUserStore();
        userStore.logout();
        router.push(`/login?redirect=${router.currentRoute.value.fullPath}`);
        break;
      case 403:
        ElMessage.error('无权访问');
        router.push('/403');
        break;
      case 404:
        ElMessage.error('请求地址不存在');
        break;
      case 500:
        ElMessage.error('服务器异常');
        break;
      default:
        ElMessage.error('请求失败，请重试');
    }

    return Promise.reject(error);
  }
);

// 封装请求方法
// 修复后的 request 封装
const request = {
  // 只保留 url 和 config 两个参数，params 作为 config 的属性传入
  get<T = any>(url: string, config?: ExtendedAxiosRequestConfig, p0?: { showLoading: boolean; }): Promise<ResultData<T>> {
    return http.get(url, config).then(res => res.data);
  },
  post<T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig): Promise<ResultData<T>> {
    return http.post(url, data, config).then(res => res.data);
  },
  put<T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig): Promise<ResultData<T>> {
    return http.put(url, data, config).then(res => res.data);
  },
  delete<T = any>(url: string, config?: ExtendedAxiosRequestConfig): Promise<ResultData<T>> {
    return http.delete(url, config).then(res => res.data);
  }
};

export default request;