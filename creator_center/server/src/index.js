require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// 导入路由
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const analyticsRoutes = require('./routes/analytics');
const inspirationRoutes = require('./routes/inspiration');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/inspiration', inspirationRoutes);
app.use('/api/ai', aiRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 