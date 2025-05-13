const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 临时解决方案：允许灵感中心和AI相关路由无需认证
    if (req.path.startsWith('/inspiration') || req.path.startsWith('/ai')) {
      // 为这些路由添加模拟用户
      req.user = { id: 1, username: 'guest' };
      return next();
    }
    
    // 从请求头获取token (支持两种格式)
    let token;
    
    // 检查Authorization头 (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // 检查x-auth-token头
    else if (req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'];
    }
    
    if (!token) {
      return res.status(401).json({
        message: '无token提供，身份验证失败'
      });
    }
    
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // 将解码后的用户信息添加到请求对象
    req.user = decoded.user;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      message: '身份验证失败'
    });
  }
}; 