import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/stores/user.store';
import { authService } from '@/services/auth.service';

// 响应类型
interface BaseResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 请求配置选项
interface RequestOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
  withToken?: boolean;
  retry?: boolean;
}

// 获取存储的令牌
const getToken = (): string => {
  return localStorage.getItem('auth_token') || '';
};

// 设置令牌
const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// 获取刷新令牌
const getRefreshToken = (): string => {
  return localStorage.getItem('refresh_token') || '';
};

// 设置刷新令牌
const setRefreshToken = (token: string): void => {
  localStorage.setItem('refresh_token', token);
};

// 清除令牌
const clearTokens = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
};

// 请求函数
export async function request<T = any>({
  url,
  method,
  data,
  params,
  headers = {},
  responseType = 'json',
  withToken = true,
  retry = true,
}: RequestOptions): Promise<T> {
  let result: any;
  
  // 准备请求配置
  const requestConfig: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    } as Record<string, string>,
  };

  // 添加认证令牌
  if (withToken) {
    const token = getToken();
    if (token) {
      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  // 添加请求体
  if (data) {
    // 检查是否为FormData类型
    if (data instanceof FormData) {
      requestConfig.body = data;
      // 使用类型断言确保安全访问
      const headerRecord = requestConfig.headers as Record<string, string>;
      delete headerRecord['Content-Type'];
    } else {
      requestConfig.body = JSON.stringify(data);
    }
  }

  // 处理查询参数
  if (params) {
    const queryString = Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== null)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  try {
    // 发送请求
    const response = await fetch(url, requestConfig);

    // 处理令牌失效
    if (response.status === 401 && retry) {
      // 尝试刷新令牌
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const refreshResult = await authService.refreshToken(refreshToken);
          setToken(refreshResult.token);
          setRefreshToken(refreshResult.refreshToken);

          // 使用新令牌重试请求
          return request<T>({
            ...arguments[0],
            retry: false, // 防止无限循环重试
          });
        } catch (refreshError) {
          // 如果刷新令牌失败，清除所有令牌并跳转到登录页
          clearTokens();
          const userStore = useUserStore();
          userStore.clearUser();
          window.location.href = '/auth/login';
          throw new Error('登录已过期，请重新登录');
        }
      } else {
        // 无刷新令牌，直接跳转登录页
        window.location.href = '/auth/login';
        throw new Error('请先登录');
      }
    }

    // 处理HTTP错误
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }

    // 根据响应类型处理响应
    if (responseType === 'json') {
      result = await response.json();
    } else if (responseType === 'text') {
      result = await response.text();
    } else if (responseType === 'blob') {
      result = await response.blob();
    } else if (responseType === 'arrayBuffer') {
      result = await response.arrayBuffer();
    } else if (responseType === 'formData') {
      result = await response.formData();
    }

    // 处理业务错误
    if (responseType === 'json') {
      // 检查响应中的success字段 - 后端使用success判断是否成功
      if ((result as any).success === false) {
        const errorMsg = (result as any).message || '请求失败';
        Message.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      // 如果是成功响应，直接返回数据
      return responseType === 'json' ? (result as any).data || result : result;
    }
  } catch (error: unknown) {
    // 显示错误消息
    const errorMessage = error instanceof Error ? error.message : '请求发生错误';
    Message.error(errorMessage);
    throw error;
  }
  
  // 添加这行作为默认返回
  return result as T;
}

// 简便方法
export const get = <T = any>(url: string, params?: any, options?: Partial<RequestOptions>) =>
  request<T>({ url, method: 'GET', params, ...options });

export const post = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) =>
  request<T>({ url, method: 'POST', data, ...options });

export const put = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) =>
  request<T>({ url, method: 'PUT', data, ...options });

export const del = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) =>
  request<T>({ url, method: 'DELETE', data, ...options });

export const patch = <T = any>(url: string, data?: any, options?: Partial<RequestOptions>) =>
  request<T>({ url, method: 'PATCH', data, ...options }); 