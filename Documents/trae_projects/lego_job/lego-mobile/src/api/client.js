import Constants from 'expo-constants';
import { Platform } from 'react-native';
import logger from '../utils/logger';

const getApiBase = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:8788/api';
  }
  return Constants.expoConfig?.extra?.apiBaseUrl || 'http://10.0.2.2:8788/api';
};

const API_BASE = getApiBase();
const CACHE_DURATION = 30000;
const REQUEST_TIMEOUT = 15000;

logger.info('API', `API Base URL: ${API_BASE}`);

class APIClient {
  constructor() {
    this.baseURL = API_BASE;
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  getCacheKey(endpoint, options) {
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${endpoint}:${body}`;
  }

  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      logger.api.cacheHit(key.split(':')[0]);
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
    logger.api.cacheMiss(key.split(':')[0]);
    if (this.cache.size > 50) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  async timeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('请求超时')), ms)
      ),
    ]);
  }

  async request(endpoint, options = {}) {
    const method = options.method || 'GET';
    const cacheKey = this.getCacheKey(endpoint, options);
    
    if (method === 'GET') {
      const cached = this.getCached(cacheKey);
      if (cached) {
        return cached;
      }
      
      if (this.pendingRequests.has(cacheKey)) {
        logger.debug('API', `Reusing pending request: ${endpoint}`);
        return this.pendingRequests.get(cacheKey);
      }
    }

    const url = `${this.baseURL}${endpoint}`;
    logger.api.request(method, endpoint, options.body || null);
    
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

    const requestPromise = this.timeout(
      fetch(url, config).then(async (response) => {
        let data;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            logger.error('API', `Parse error for ${endpoint}:`, text?.substring(0, 200));
            throw new Error('服务器返回格式错误');
          }
        }

        if (!response.ok) {
          logger.api.error(method, endpoint, data);
          throw new Error(data.error || data.message || '请求失败');
        }

        logger.api.response(method, endpoint, data);
        
        if (method === 'GET') {
          this.setCache(cacheKey, data);
        }

        return data;
      }).catch((error) => {
        if (error.message === 'Network request failed' || error.message.includes('Failed to fetch')) {
          logger.api.error(method, endpoint, 'Network error');
          throw new Error('网络连接失败，请检查网络');
        }
        throw error;
      }).finally(() => {
        this.pendingRequests.delete(cacheKey);
      }),
      REQUEST_TIMEOUT
    );

    if (method === 'GET') {
      this.pendingRequests.set(cacheKey, requestPromise);
    }

    return requestPromise;
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

  clearCache() {
    this.cache.clear();
  }
}

export const apiClient = new APIClient();
export default apiClient;
