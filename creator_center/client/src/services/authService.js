import api from './api';

// 用户登录
const login = async (email, password) => {
  return await api.post('/auth/login', { email, password });
};

// 用户注册
const register = async (username, email, password) => {
  return await api.post('/auth/register', { username, email, password });
};

// 获取当前用户信息
const getCurrentUser = async () => {
  return await api.get('/auth/me');
};

const authService = {
  login,
  register,
  getCurrentUser
};

export default authService; 