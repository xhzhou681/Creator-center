import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Tabs, 
  Tab, 
  Divider, 
  CircularProgress,
  Chip,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  AlertTitle
} from '@mui/material';
import { 
  TrendingUp, 
  Whatshot, 
  EmojiEvents, 
  PersonAdd, 
  BarChart,
  PlayArrow,
  Refresh
} from '@mui/icons-material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import inspirationService from '../services/inspirationService';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function InspirationCenter() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [popularVideos, setPopularVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [recommendedCreators, setRecommendedCreators] = useState([]);
  const [contentTrends, setContentTrends] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('开始加载灵感中心数据...');
      
      // 获取热门内容数据
      const popularData = await inspirationService.getPopularContent();
      console.log('获取到热门内容数据:', popularData);
      
      if (!popularData || (!popularData.videos && !popularData.topics)) {
        throw new Error('热门内容数据格式不正确');
      }
      
      setPopularVideos(popularData.videos || []);
      setFilteredVideos(popularData.videos || []);
      setTrendingTopics(popularData.topics || []);
      
      // 获取推荐创作者数据
      const creatorsData = await inspirationService.getRecommendedCreators();
      console.log('获取到推荐创作者数据:', creatorsData);
      setRecommendedCreators(Array.isArray(creatorsData) ? creatorsData : []);
      
      // 获取内容趋势分析数据
      const trendsData = await inspirationService.getContentTrends();
      console.log('获取到内容趋势数据:', trendsData);
      setContentTrends(trendsData || {});
      
      console.log('灵感中心数据加载完成');
    } catch (error) {
      console.error('加载灵感中心数据失败:', error);
      setError('加载数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 处理重新加载
  const handleRetry = () => {
    fetchData();
  };

  // 处理标签页变化
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 处理话题点击
  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setTopicDialogOpen(true);
  };

  // 关闭话题对话框
  const handleCloseTopicDialog = () => {
    setTopicDialogOpen(false);
  };

  // 应用话题过滤
  const applyTopicFilter = (topic) => {
    setTopicDialogOpen(false);
    
    if (activeFilter && activeFilter.id === topic.id) {
      // 如果点击的是当前已激活的过滤器，则取消过滤
      setActiveFilter(null);
      setFilteredVideos(popularVideos);
    } else {
      // 应用新的过滤器
      setActiveFilter(topic);
      
      // 模拟基于话题过滤视频
      // 在实际应用中，这里可能需要调用API获取与话题相关的视频
      const filtered = popularVideos.filter((video, index) => {
        // 这里使用简单的算法模拟过滤，实际应用中应该基于真实关联
        return video.title.toLowerCase().includes(topic.name.toLowerCase()) || 
               index % (topic.id + 1) === 0; // 使用话题ID创建一些变化
      });
      
      setFilteredVideos(filtered.length > 0 ? filtered : popularVideos);
    }
  };

  // 渲染热门内容标签页
  const renderPopularContent = () => {
    if (trendingTopics.length === 0 && filteredVideos.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            暂无热门内容数据
          </Typography>
        </Box>
      );
    }
    
    return (
      <Box>
        {/* 热门话题 */}
        {trendingTopics.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Whatshot color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">热门话题</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {trendingTopics.map((topic, index) => (
                <Chip 
                  key={index} 
                  label={`#${topic.name}`} 
                  color={(activeFilter && activeFilter.id === topic.id) ? "secondary" : (index < 3 ? "primary" : "default")} 
                  variant={(activeFilter && activeFilter.id === topic.id) ? "filled" : (index < 3 ? "filled" : "outlined")}
                  onClick={() => handleTopicClick(topic)}
                  clickable
                />
              ))}
              {activeFilter && (
                <Chip
                  label="清除过滤"
                  color="default"
                  variant="outlined"
                  onDelete={() => {
                    setActiveFilter(null);
                    setFilteredVideos(popularVideos);
                  }}
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
          </Box>
        )}
        
        {/* 热门视频 */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmojiEvents color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6">
              热门视频
              {activeFilter && (
                <Typography component="span" variant="subtitle2" sx={{ ml: 1 }}>
                  (已过滤: #{activeFilter.name})
                </Typography>
              )}
            </Typography>
          </Box>
          {filteredVideos.length > 0 ? (
            <Grid container spacing={3}>
              {filteredVideos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardActionArea>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={video.thumbnail}
                          alt={video.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x300?text=视频缩略图';
                          }}
                        />
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            right: 0, 
                            bgcolor: 'rgba(0,0,0,0.6)', 
                            p: 0.5, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between' 
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PlayArrow fontSize="small" sx={{ color: 'white' }} />
                            <Typography variant="caption" sx={{ color: 'white', ml: 0.5 }}>
                              {video.views} 次观看
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: 'white' }}>
                            {video.duration}
                          </Typography>
                        </Box>
                      </Box>
                      <CardContent>
                        <Typography gutterBottom variant="subtitle1" component="div" noWrap>
                          {video.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Avatar 
                            src={video.creator.avatar}
                            alt={video.creator.name}
                            sx={{ width: 24, height: 24, mr: 1 }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/50x50?text=用户';
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {video.creator.name}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                没有找到与所选话题相关的视频
              </Typography>
            </Box>
          )}
        </Box>

        {/* 话题详情对话框 */}
        <Dialog
          open={topicDialogOpen}
          onClose={handleCloseTopicDialog}
          aria-labelledby="topic-dialog-title"
          aria-describedby="topic-dialog-description"
        >
          <DialogTitle id="topic-dialog-title">
            #{selectedTopic?.name}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="topic-dialog-description">
              该话题已有 {selectedTopic?.count} 个相关内容。您可以查看与该话题相关的视频。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTopicDialog}>关闭</Button>
            <Button 
              onClick={() => applyTopicFilter(selectedTopic)} 
              color="primary" 
              autoFocus
            >
              {activeFilter && activeFilter.id === selectedTopic?.id ? '取消过滤' : '应用过滤'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  // 渲染创作者推荐标签页
  const renderCreatorRecommendations = () => {
    return (
      <Box>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          根据您的兴趣和活动，我们为您推荐以下创作者：
        </Typography>
        
        <List sx={{ bgcolor: 'background.paper' }}>
          {recommendedCreators.map((creator) => (
            <React.Fragment key={creator.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={creator.avatar} alt={creator.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={creator.name}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {creator.category}
                      </Typography>
                      {` — ${creator.description}`}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<PersonAdd />}
                    onClick={() => console.log(`Follow creator: ${creator.name}`)}
                  >
                    关注
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
    );
  };

  // 渲染内容趋势分析标签页
  const renderContentTrends = () => {
    if (!contentTrends.categories || !contentTrends.viewsByCategory) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            暂无趋势数据
          </Typography>
        </Box>
      );
    }
    
    const chartData = {
      labels: contentTrends.categories,
      datasets: [
        {
          label: '观看量',
          data: contentTrends.viewsByCategory,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: '互动量',
          data: contentTrends.engagementByCategory,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
    
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: '各类别内容表现',
        },
      },
    };

    return (
      <Box>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          了解当前平台内容趋势，把握创作方向
        </Typography>
        
        {/* 类别表现图表 */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            类别表现分析
          </Typography>
          <Box sx={{ height: 300 }}>
            <Bar options={chartOptions} data={chartData} />
          </Box>
        </Paper>
        
        {/* 热门趋势列表 */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            近期热门趋势
          </Typography>
          <List>
            {contentTrends.recentTrends && contentTrends.recentTrends.map((trend, index) => (
              <ListItem key={index} divider={index < contentTrends.recentTrends.length - 1}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: index < 3 ? 'primary.main' : 'grey.400' }}>
                    {index + 1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={trend.name}
                  secondary={`增长率: ${trend.growthRate}% | 参与度: ${trend.engagement}%`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="trend">
                    <TrendingUp color={index < 3 ? "primary" : "action"} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 8 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          加载中...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          灵感中心
        </Typography>
        <Typography variant="body1" color="text.secondary">
          发现热门内容，获取创作灵感，把握内容趋势
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<Refresh />}
              onClick={handleRetry}
            >
              重试
            </Button>
          }
        >
          <AlertTitle>加载失败</AlertTitle>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="灵感中心标签页"
          variant="fullWidth"
        >
          <Tab 
            icon={<Whatshot />} 
            label="热门内容" 
            id="tab-0" 
            aria-controls="tabpanel-0" 
          />
          <Tab 
            icon={<PersonAdd />} 
            label="创作者推荐" 
            id="tab-1" 
            aria-controls="tabpanel-1" 
          />
          <Tab 
            icon={<BarChart />} 
            label="内容趋势分析" 
            id="tab-2" 
            aria-controls="tabpanel-2" 
          />
        </Tabs>
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" aria-labelledby="tab-0">
        {tabValue === 0 && renderPopularContent()}
      </Box>
      <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" aria-labelledby="tab-1">
        {tabValue === 1 && renderCreatorRecommendations()}
      </Box>
      <Box role="tabpanel" hidden={tabValue !== 2} id="tabpanel-2" aria-labelledby="tab-2">
        {tabValue === 2 && renderContentTrends()}
      </Box>
    </Container>
  );
} 