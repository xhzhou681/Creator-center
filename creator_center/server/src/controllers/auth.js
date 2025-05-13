const pool = require('../utils/db');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '用户名或邮箱已存在' });
    }

    // 哈希密码
    const hashedPassword = await hashPassword(password);

    // 创建新用户
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    const user = {
      id: result.insertId,
      username,
      email
    };

    // 生成JWT
    const token = generateToken(user);

    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });

    // 查找用户
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    console.log('User found:', users.length > 0);

    if (users.length === 0) {
      return res.status(400).json({ message: '邮箱或密码错误' });
    }

    const user = users[0];
    
    console.log('User data:', { id: user.id, username: user.username, passwordLength: user.password ? user.password.length : 0 });

    // 如果密码是明文存储的 (临时解决方案)
    if (user.password === password) {
      console.log('Plain text password match');
      
      // 生成JWT
      const token = generateToken(user);

      return res.json({
        message: '登录成功',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar || user.avatar_url
        }
      });
    }

    // 验证哈希密码
    try {
      const isMatch = await comparePassword(password, user.password);
      console.log('Password match result:', isMatch);

      if (!isMatch) {
        return res.status(400).json({ message: '邮箱或密码错误' });
      }
    } catch (passwordError) {
      console.error('Password comparison error:', passwordError);
      return res.status(400).json({ message: '邮箱或密码错误 (验证错误)' });
    }

    // 生成JWT
    const token = generateToken(user);

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || user.avatar_url
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取当前用户信息
exports.getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, avatar, avatar_url, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    const user = users[0];
    
    // 确保头像字段正确
    user.avatar = user.avatar || user.avatar_url;

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 