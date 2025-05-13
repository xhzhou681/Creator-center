import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import analyticsService from '../services/analyticsService';
import videoService from '../services/videoService';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// 图表组件
const LineChart = ({ data, title, color = 'rgb(53, 162, 235)' }) => {
  const chartData = {
    labels: data.map(item => item.period),
    datasets: [
      {
        label: title,
        data: data.map(item => item.value),
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

const BarChart = ({ data, title, colors }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: title,
        data: data.map(item => item.value),
        backgroundColor: colors || [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

const PieChart = ({ data, title }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: title,
        data: data.map(item => item.value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

// 小的统计卡片
const StatCard = ({ title, value, unit, color }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" color={color || 'primary'}>
        {value} {unit && <Typography component="span" variant="body2">{unit}</Typography>}
      </Typography>
    </Paper>
  );
};

export default function Analytics() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const videoIdFromUrl = query.get('video');
  
  const [timeframe, setTimeframe] = useState('week');
  const [tabValue, setTabValue] = useState(0);
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(videoIdFromUrl || 'all');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 加载视频列表
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await videoService.getUserVideos();
        setVideos(data);
      } catch (error) {
        console.error('Load videos error:', error);
      }
    };

    fetchVideos();
  }, []);

  // 加载分析数据
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        if (selectedVideoId === 'all' || !selectedVideoId) {
          // 获取所有视频的总体分析
          const data = await analyticsService.getUserAnalytics(timeframe);
          setAnalytics(data);
        } else {
          // 获取特定视频的分析
          const data = await analyticsService.getVideoAnalytics(selectedVideoId);
          
          // 转换数据格式以便显示
          const processedData = {
            totalViews: data.reduce((sum, item) => sum + item.views, 0),
            totalLikes: data.reduce((sum, item) => sum + item.likes, 0),
            totalComments: data.reduce((sum, item) => sum + item.comments, 0),
            totalShares: data.reduce((sum, item) => sum + item.shares, 0),
            avgWatchTime: Math.round(data.reduce((sum, item) => sum + item.watch_time, 0) / (data.length || 1)),
            periodData: data.map(item => ({
              period: new Date(item.date).toLocaleDateString(),
              views: item.views,
              likes: item.likes,
              comments: item.comments,
              shares: item.shares,
              watchTime: item.watch_time
            }))
          };
          
          setAnalytics(processedData);
        }
      } catch (error) {
        console.error('Load analytics error:', error);
        setError('加载分析数据失败');
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
    fetchAnalytics();
  }, [selectedVideoId, timeframe]);

  // 处理选择视频变化
  const handleVideoChange = (event) => {
    setSelectedVideoId(event.target.value);
  };

  // 处理时间范围变化
  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  // 处理标签页变化
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 准备图表数据
  const prepareChartData = () => {
    if (!analytics) return null;
    
    // 趋势图表数据
    const trendCharts = {
      views: [],
      likes: [],
      comments: []
    };
    
    // 受众数据
    const audienceCharts = {
      ageGroups: [
        { label: '18-24岁', value: Math.floor(Math.random() * 100) + 50 },
        { label: '25-34岁', value: Math.floor(Math.random() * 150) + 100 },
        { label: '35-44岁', value: Math.floor(Math.random() * 80) + 30 },
        { label: '45-54岁', value: Math.floor(Math.random() * 50) + 20 },
        { label: '55岁以上', value: Math.floor(Math.random() * 30) + 10 }
      ],
      geography: [
        { label: '北京', value: Math.floor(Math.random() * 1000) + 500 },
        { label: '上海', value: Math.floor(Math.random() * 900) + 450 },
        { label: '广州', value: Math.floor(Math.random() * 700) + 350 },
        { label: '深圳', value: Math.floor(Math.random() * 600) + 300 },
        { label: '其他', value: Math.floor(Math.random() * 1500) + 1000 }
      ],
      devices: [
        { label: '手机', value: Math.floor(Math.random() * 2000) + 1500 },
        { label: '平板', value: Math.floor(Math.random() * 500) + 200 },
        { label: '桌面', value: Math.floor(Math.random() * 300) + 100 }
      ]
    };
    
    // 互动数据
    const interactionCharts = {
      engagementRate: [
        { label: '点赞率', value: (analytics.totalLikes / (analytics.totalViews || 1) * 100).toFixed(2) },
        { label: '评论率', value: (analytics.totalComments / (analytics.totalViews || 1) * 100).toFixed(2) },
        { label: '分享率', value: (analytics.totalShares / (analytics.totalViews || 1) * 100).toFixed(2) }
      ],
      completionRate: Array.from({ length: 10 }, (_, i) => ({
        label: `${i*10}-${(i+1)*10}%`,
        value: Math.floor(Math.random() * 100) + 100 - (i * 10)
      }))
    };
    
    // 处理时间序列数据
    if (analytics.periodData) {
      // 提取周期数据点
      analytics.periodData.forEach(item => {
        trendCharts.views.push({ period: item.period, value: item.views });
        trendCharts.likes.push({ period: item.period, value: item.likes });
        trendCharts.comments.push({ period: item.period, value: item.comments });
      });
      
      // 按时间顺序排序
      trendCharts.views.sort((a, b) => new Date(a.period) - new Date(b.period));
      trendCharts.likes.sort((a, b) => new Date(a.period) - new Date(b.period));
      trendCharts.comments.sort((a, b) => new Date(a.period) - new Date(b.period));
    }
    
    return {
      trendCharts,
      audienceCharts,
      interactionCharts
    };
  };

  const chartData = prepareChartData();

  if (loading && !analytics) {
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
          数据分析
        </Typography>
        <Typography variant="body1" color="textSecondary">
          查看您的内容表现和受众互动数据
        </Typography>
      </Box>

      {error && (
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {/* 筛选控件 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="video-select-label">选择视频</InputLabel>
              <Select
                labelId="video-select-label"
                value={selectedVideoId}
                label="选择视频"
                onChange={handleVideoChange}
              >
                <MenuItem value="all">所有视频</MenuItem>
                {videos.map((video) => (
                  <MenuItem key={video.id} value={video.id}>
                    {video.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="timeframe-select-label">时间范围</InputLabel>
              <Select
                labelId="timeframe-select-label"
                value={timeframe}
                label="时间范围"
                onChange={handleTimeframeChange}
                disabled={selectedVideoId !== 'all'}
              >
                <MenuItem value="day">今日</MenuItem>
                <MenuItem value="week">本周</MenuItem>
                <MenuItem value="month">本月</MenuItem>
                <MenuItem value="year">本年</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* 数据概览 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          数据概览
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {analytics && (
          <Grid container spacing={3}>
            <Grid item xs={6} sm={4} md={2}>
              <StatCard 
                title="总播放量" 
                value={analytics.totalViews || 0} 
                color="#4caf50"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <StatCard 
                title="总点赞数" 
                value={analytics.totalLikes || 0} 
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <StatCard 
                title="总评论数" 
                value={analytics.totalComments || 0} 
                color="#ff9800"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <StatCard 
                title="总分享数" 
                value={analytics.totalShares || 0} 
                color="#9c27b0"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <StatCard 
                title="总视频数" 
                value={analytics.totalVideos || 0} 
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <StatCard 
                title="平均观看时长" 
                value={analytics.avgWatchTime || 0} 
                unit="秒"
                color="#f44336"
              />
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* 详细分析 */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="分析标签页">
            <Tab label="趋势" />
            <Tab label="受众" />
            <Tab label="互动" />
          </Tabs>
        </Box>

        {chartData && tabValue === 0 && (
          <Box>
            <Paper sx={{ p: 2, mb: 3 }}>
              <LineChart 
                data={chartData.trendCharts.views} 
                title="观看趋势" 
                color="rgb(76, 175, 80)"
              />
            </Paper>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <LineChart 
                    data={chartData.trendCharts.likes} 
                    title="点赞趋势" 
                    color="rgb(33, 150, 243)"
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <LineChart 
                    data={chartData.trendCharts.comments} 
                    title="评论趋势" 
                    color="rgb(255, 152, 0)"
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {chartData && tabValue === 1 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <PieChart 
                    data={chartData.audienceCharts.ageGroups} 
                    title="受众年龄分布"
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <BarChart 
                    data={chartData.audienceCharts.geography} 
                    title="受众地理分布"
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <PieChart 
                    data={chartData.audienceCharts.devices} 
                    title="观看设备类型"
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {chartData && tabValue === 2 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <BarChart 
                    data={chartData.interactionCharts.engagementRate} 
                    title="互动率 (%)"
                    colors={['rgba(33, 150, 243, 0.6)', 'rgba(255, 152, 0, 0.6)', 'rgba(156, 39, 176, 0.6)']}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, mb: 3 }}>
                  <BarChart 
                    data={chartData.interactionCharts.completionRate} 
                    title="观看完成率"
                    colors={chartData.interactionCharts.completionRate.map(() => 'rgba(76, 175, 80, 0.6)')}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
} 