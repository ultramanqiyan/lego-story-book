import Constants from 'expo-constants';
import { Platform } from 'react-native';

// 根据平台选择正确的 API 地址
const getApiBase = () => {
  if (Platform.OS === 'web') {
    // Web 端使用相对路径或本地开发服务器地址
    return 'http://localhost:8788/api';
  }
  return Constants.expoConfig?.extra?.apiBaseUrl || 'http://10.0.2.2:8788/api';
};

const API_BASE = getApiBase();

class APIClient {
  constructor() {
    this.baseURL = API_BASE;
    console.log('[APIClient] Initialized with baseURL:', this.baseURL);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('[APIClient] Making request to:', url);
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error('服务器返回格式错误');
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || '请求失败');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      if (error.message === 'Network request failed' || error.message.includes('Failed to fetch')) {
        throw new Error('网络连接失败，请检查网络或后端服务是否启动');
      }
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new APIClient();
export default apiClient;
