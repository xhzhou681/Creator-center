const express = require('express');
const { register, login, getMe } = require('../controllers/auth');
const auth = require('../middleware/auth');
const router = express.Router();

// 注册新用户
router.post('/register', register);

// 用户登录
router.post('/login', login);

// 获取当前用户信息
router.get('/me', auth, getMe);

module.exports = router; 