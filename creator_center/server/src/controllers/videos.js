const pool = require('../utils/db');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// 上传视频目录
const UPLOAD_DIR = path.join(__dirname, '../../uploads/videos');

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 获取用户的所有视频
exports.getUserVideos = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [videos] = await pool.query(
      `SELECT id, title, description, file_path, thumbnail_path, status, created_at, updated_at 
       FROM videos 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );
    
    res.json(videos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取单个视频详情
exports.getVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;
    
    const [videos] = await pool.query(
      `SELECT id, user_id, title, description, file_path, thumbnail_path, status, created_at, updated_at 
       FROM videos 
       WHERE id = ?`,
      [videoId]
    );
    
    if (videos.length === 0) {
      return res.status(404).json({ message: '视频不存在' });
    }
    
    const video = videos[0];
    
    // 检查是否为视频拥有者
    if (video.user_id !== userId) {
      return res.status(403).json({ message: '无权访问此视频' });
    }
    
    res.json(video);
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建视频（模拟）
exports.createVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
    
    // 这里简化处理，实际应该处理文件上传
    const filePath = '/uploads/videos/sample.mp4';
    const thumbnailPath = '/uploads/thumbnails/sample.jpg';
    
    const [result] = await pool.query(
      `INSERT INTO videos (user_id, title, description, file_path, thumbnail_path, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, title, description, filePath, thumbnailPath, 'draft']
    );
    
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      file_path: filePath,
      thumbnail_path: thumbnailPath,
      status: 'draft'
    });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 上传视频
exports.uploadVideo = async (req, res) => {
  try {
    // 检查是否有文件上传
    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: '没有上传视频文件' });
    }

    const { title, description } = req.body;
    const userId = req.user.id;
    
    // 获取上传的视频文件路径
    const videoFile = req.files.video[0];
    const filePath = `/uploads/videos/${path.basename(videoFile.path)}`;
    
    // 处理缩略图
    let thumbnailPath = '/uploads/thumbnails/default.jpg';
    if (req.files.thumbnail && req.files.thumbnail[0]) {
      const thumbnailFile = req.files.thumbnail[0];
      thumbnailPath = `/uploads/thumbnails/${path.basename(thumbnailFile.path)}`;
    }
    
    // 保存视频信息到数据库
    const [result] = await pool.query(
      `INSERT INTO videos (user_id, title, description, file_path, thumbnail_path, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, title, description, filePath, thumbnailPath, 'draft']
    );
    
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      file_path: filePath,
      thumbnail_path: thumbnailPath,
      status: 'draft',
      message: '视频上传成功'
    });
  } catch (error) {
    console.error('Upload video error:', error);
    
    // 如果上传失败，删除已上传的文件
    if (req.files) {
      try {
        if (req.files.video && req.files.video[0]) {
          await unlinkAsync(req.files.video[0].path);
        }
        if (req.files.thumbnail && req.files.thumbnail[0]) {
          await unlinkAsync(req.files.thumbnail[0].path);
        }
      } catch (unlinkError) {
        console.error('Failed to delete files:', unlinkError);
      }
    }
    
    res.status(500).json({ message: '视频上传失败' });
  }
};

// 更新视频
exports.updateVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;
    const { title, description, status } = req.body;
    
    // 检查视频是否存在并属于当前用户
    const [videos] = await pool.query(
      `SELECT id, user_id FROM videos WHERE id = ?`,
      [videoId]
    );
    
    if (videos.length === 0) {
      return res.status(404).json({ message: '视频不存在' });
    }
    
    if (videos[0].user_id !== userId) {
      return res.status(403).json({ message: '无权修改此视频' });
    }
    
    // 更新视频信息
    await pool.query(
      `UPDATE videos SET title = ?, description = ?, status = ? WHERE id = ?`,
      [title, description, status, videoId]
    );
    
    res.json({ message: '视频更新成功' });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除视频
exports.deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;
    
    // 检查视频是否存在并属于当前用户
    const [videos] = await pool.query(
      `SELECT id, user_id, file_path, thumbnail_path FROM videos WHERE id = ?`,
      [videoId]
    );
    
    if (videos.length === 0) {
      return res.status(404).json({ message: '视频不存在' });
    }
    
    if (videos[0].user_id !== userId) {
      return res.status(403).json({ message: '无权删除此视频' });
    }
    
    // 删除视频文件
    const video = videos[0];
    if (video.file_path && !video.file_path.includes('sample.mp4')) {
      const filePath = path.join(__dirname, '../../', video.file_path);
      if (fs.existsSync(filePath)) {
        await unlinkAsync(filePath);
      }
    }
    
    // 删除缩略图文件
    if (video.thumbnail_path && !video.thumbnail_path.includes('sample.jpg')) {
      const thumbnailPath = path.join(__dirname, '../../', video.thumbnail_path);
      if (fs.existsSync(thumbnailPath)) {
        await unlinkAsync(thumbnailPath);
      }
    }
    
    // 删除视频记录
    await pool.query(`DELETE FROM videos WHERE id = ?`, [videoId]);
    
    res.json({ message: '视频删除成功' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 