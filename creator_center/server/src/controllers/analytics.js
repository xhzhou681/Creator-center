const pool = require('../utils/db');

// 获取视频的分析数据
exports.getVideoAnalytics = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;
    
    // 验证视频属于当前用户
    const [videos] = await pool.query(
      'SELECT id, user_id FROM videos WHERE id = ?',
      [videoId]
    );
    
    if (videos.length === 0) {
      return res.status(404).json({ message: '视频不存在' });
    }
    
    if (videos[0].user_id !== userId) {
      return res.status(403).json({ message: '无权访问此视频的分析数据' });
    }
    
    // 获取分析数据
    const [analytics] = await pool.query(
      'SELECT * FROM analytics WHERE video_id = ? ORDER BY date DESC',
      [videoId]
    );
    
    res.json(analytics);
  } catch (error) {
    console.error('Get video analytics error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取用户所有视频的总体分析数据
exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe } = req.query; // 可以是day, week, month, year
    
    let dateFilter = '';
    switch (timeframe) {
      case 'week':
        dateFilter = 'AND a.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
        break;
      case 'month':
        dateFilter = 'AND a.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
        break;
      case 'year':
        dateFilter = 'AND a.date >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)';
        break;
      default: // day or not specified
        dateFilter = 'AND a.date = CURDATE()';
    }
    
    // 为简化，这里只返回模拟数据
    // 实际应用中应该聚合数据库中的真实数据
    
    // 获取用户的视频数量
    const [videoCount] = await pool.query(
      'SELECT COUNT(*) as count FROM videos WHERE user_id = ?',
      [userId]
    );
    
    // 生成模拟数据
    const totalViews = Math.floor(Math.random() * 10000);
    const totalLikes = Math.floor(totalViews * 0.7);
    const totalComments = Math.floor(totalViews * 0.1);
    const totalShares = Math.floor(totalViews * 0.05);
    
    // 假设每个视频的平均观看时长（秒）
    const avgWatchTime = Math.floor(Math.random() * 120) + 20;
    
    const analytics = {
      totalVideos: videoCount[0].count,
      totalViews,
      totalLikes, 
      totalComments,
      totalShares,
      avgWatchTime,
      periodData: []
    };
    
    // 生成时间序列数据（简化示例）
    const periods = timeframe === 'day' ? 24 : (timeframe === 'week' ? 7 : (timeframe === 'month' ? 30 : 12));
    
    for (let i = 0; i < periods; i++) {
      analytics.periodData.push({
        period: i.toString(),
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 100)
      });
    }
    
    res.json(analytics);
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 生成模拟分析数据（仅用于演示）
exports.generateMockData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 获取用户的所有视频
    const [videos] = await pool.query(
      'SELECT id FROM videos WHERE user_id = ?',
      [userId]
    );
    
    if (videos.length === 0) {
      return res.status(404).json({ message: '未找到任何视频' });
    }
    
    // 生成过去30天的模拟数据
    const today = new Date();
    
    for (const video of videos) {
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // 生成随机数据
        const views = Math.floor(Math.random() * 1000);
        const likes = Math.floor(views * 0.7);
        const comments = Math.floor(views * 0.1);
        const shares = Math.floor(views * 0.05);
        const watchTime = Math.floor(Math.random() * 120) + 20;
        
        // 检查是否已存在该日期的数据
        const [existing] = await pool.query(
          'SELECT id FROM analytics WHERE video_id = ? AND date = ?',
          [video.id, dateStr]
        );
        
        if (existing.length === 0) {
          // 插入新数据
          await pool.query(
            'INSERT INTO analytics (video_id, views, likes, comments, shares, watch_time, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [video.id, views, likes, comments, shares, watchTime, dateStr]
          );
        } else {
          // 更新已有数据
          await pool.query(
            'UPDATE analytics SET views = ?, likes = ?, comments = ?, shares = ?, watch_time = ? WHERE id = ?',
            [views, likes, comments, shares, watchTime, existing[0].id]
          );
        }
      }
    }
    
    res.json({ message: '模拟数据生成成功' });
  } catch (error) {
    console.error('Generate mock data error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 