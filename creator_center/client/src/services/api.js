import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加token到请求头
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // 同时设置两种认证头，确保兼容性
      config.headers['x-auth-token'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('API Request:', { 
      url: config.url, 
      method: config.method, 
      hasToken: !!token 
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理常见错误
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', { 
      url: response.config.url, 
      status: response.status,
      hasData: !!response.data 
    });
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    // 如果是401错误，可能是token过期，清除本地token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 