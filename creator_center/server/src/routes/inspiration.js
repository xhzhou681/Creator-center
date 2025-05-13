const express = require('express');
const { 
  getPopularContent, 
  getRecommendedCreators, 
  getContentTrends 
} = require('../controllers/inspiration');
// 导入但不使用认证中间件，因为我们希望这些路由公开访问
// const auth = require('../middleware/auth');

const router = express.Router();

// 不使用认证中间件
// router.use(auth);

// 获取热门内容
router.get('/popular', getPopularContent);

// 获取推荐创作者
router.get('/creators', getRecommendedCreators);

// 获取内容趋势分析
router.get('/trends', getContentTrends);

module.exports = router; 