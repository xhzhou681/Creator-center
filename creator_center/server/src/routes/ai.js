const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai');
const auth = require('../middleware/auth');

// AI聊天API端点
router.post('/chat', auth, aiController.chatWithAI);

// 获取创作灵感API端点
router.post('/inspirations', auth, aiController.getInspirations);

// 内容分析API端点
router.post('/analyze', auth, aiController.analyzeContent);

module.exports = router; 