import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import TimerIcon from '@mui/icons-material/Timer';
import analyticsService from '../services/analyticsService';
import videoService from '../services/videoService';
import { useAuth } from '../hooks/useAuth';

// 简单的图表组件
const SimpleStatsCard = ({ icon, title, value, color }) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {icon}
          <Typography variant="subtitle1" color="textSecondary" ml={1}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" color={color || 'primary'}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

// 最近视频卡片
const RecentVideoCard = ({ video }) => {
  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" noWrap>
          {video.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" noWrap>
          {video.description ? video.description.substring(0, 100) : '无描述'}
        </Typography>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography variant="caption" color="textSecondary">
            状态: {video.status === 'published' ? '已发布' : (video.status === 'draft' ? '草稿' : '已归档')}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {new Date(video.created_at).toLocaleDateString()}
          </Typography>
        </Box>
        <Box mt={1}>
          <Button
            component={Link}
            to={`/videos/${video.id}`}
            variant="outlined"
            size="small"
            color="primary"
          >
            查看详情
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 获取分析数据
        const analyticsData = await analyticsService.getUserAnalytics('week');
        setAnalytics(analyticsData);
        
        // 获取最近的视频
        const videosData = await videoService.getUserVideos();
        setRecentVideos(videosData.slice(0, 5)); // 只显示最近5个
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
        setError('获取仪表盘数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    // 模拟数据生成（仅用于演示）
    const generateMockData = async () => {
      try {
        await analyticsService.generateMockData();
      } catch (error) {
        console.error('Mock data generation error:', error);
      }
    };
    
    generateMockData(); // 实际项目中可以删除此行
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          欢迎, {user?.username || '创作者'}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          这是您的创作者中心仪表盘，您可以在这里管理您的内容并查看数据分析。
        </Typography>
      </Box>

      {error && (
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {/* 分析数据概览 */}
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            本周数据概览
          </Typography>
          <Button component={Link} to="/analytics" color="primary">
            查看详细分析
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        {analytics ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <SimpleStatsCard 
                icon={<VideoLibraryIcon color="primary" />} 
                title="视频总数" 
                value={analytics.totalVideos || 0} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SimpleStatsCard 
                icon={<VisibilityIcon sx={{ color: '#4caf50' }} />} 
                title="总播放量" 
                value={analytics.totalViews || 0} 
                color="#4caf50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SimpleStatsCard 
                icon={<ThumbUpIcon sx={{ color: '#2196f3' }} />} 
                title="总点赞数" 
                value={analytics.totalLikes || 0} 
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SimpleStatsCard 
                icon={<CommentIcon sx={{ color: '#ff9800' }} />} 
                title="总评论数" 
                value={analytics.totalComments || 0} 
                color="#ff9800"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SimpleStatsCard 
                icon={<ShareIcon sx={{ color: '#9c27b0' }} />} 
                title="总分享数" 
                value={analytics.totalShares || 0} 
                color="#9c27b0"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <SimpleStatsCard 
                icon={<TimerIcon sx={{ color: '#f44336' }} />} 
                title="平均观看时长(秒)" 
                value={analytics.avgWatchTime || 0} 
                color="#f44336"
              />
            </Grid>
          </Grid>
        ) : (
          <Typography>暂无分析数据</Typography>
        )}
      </Paper>

      {/* 最近的视频 */}
      <Paper elevation={0} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            最近的视频
          </Typography>
          <Button 
            component={Link} 
            to="/videos" 
            color="primary"
            variant="contained"
          >
            管理所有视频
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        {recentVideos.length > 0 ? (
          <Grid container spacing={3}>
            {recentVideos.map((video) => (
              <Grid item xs={12} md={6} key={video.id}>
                <RecentVideoCard video={video} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              您还没有上传任何视频
            </Typography>
            <Button 
              component={Link} 
              to="/videos" 
              variant="contained" 
              color="primary"
              sx={{ mt: 2 }}
            >
              上传第一个视频
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
} 