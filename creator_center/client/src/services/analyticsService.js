import api from './api';

// 获取用户总体分析数据
const getUserAnalytics = async (timeframe = 'day') => {
  return await api.get(`/analytics/user?timeframe=${timeframe}`);
};

// 获取特定视频的分析数据
const getVideoAnalytics = async (videoId) => {
  return await api.get(`/analytics/video/${videoId}`);
};

// 生成模拟数据 (仅用于演示)
const generateMockData = async () => {
  return await api.post('/analytics/generate-mock');
};

const analyticsService = {
  getUserAnalytics,
  getVideoAnalytics,
  generateMockData
};

export default analyticsService; 