const express = require('express');
const { 
  getVideoAnalytics, 
  getUserAnalytics, 
  generateMockData 
} = require('../controllers/analytics');
const auth = require('../middleware/auth');

const router = express.Router();

// 所有分析路由都需要认证
router.use(auth);

// 获取用户的总体分析数据
router.get('/user', getUserAnalytics);

// 获取指定视频的分析数据
router.get('/video/:id', getVideoAnalytics);

// 生成模拟数据（仅用于演示）
router.post('/generate-mock', generateMockData);

module.exports = router; 