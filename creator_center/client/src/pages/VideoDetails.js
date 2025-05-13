import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import videoService from '../services/videoService';
import analyticsService from '../services/analyticsService';

export default function VideoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [videoAnalytics, setVideoAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 加载视频详情和分析数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 获取视频详情
        const videoData = await videoService.getVideo(id);
        setVideo(videoData);
        
        // 获取视频分析数据
        const analyticsData = await analyticsService.getVideoAnalytics(id);
        setVideoAnalytics(analyticsData);
      } catch (error) {
        console.error('Load video details error:', error);
        setError('加载视频详情失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // 处理表单变化
  const handleChange = (e) => {
    setVideo({
      ...video,
      [e.target.name]: e.target.value
    });
  };

  // 保存视频
  const handleSave = async () => {
    try {
      setSaving(true);
      await videoService.updateVideo(id, {
        title: video.title,
        description: video.description,
        status: video.status
      });
      
      setSnackbar({
        open: true,
        message: '视频更新成功',
        severity: 'success'
      });
    } catch (error) {
      console.error('Update video error:', error);
      setSnackbar({
        open: true,
        message: '视频更新失败',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // 删除视频
  const handleDelete = async () => {
    if (!window.confirm(`确认删除视频 "${video.title}"?`)) {
      return;
    }
    
    try {
      await videoService.deleteVideo(id);
      navigate('/videos');
    } catch (error) {
      console.error('Delete video error:', error);
      setSnackbar({
        open: true,
        message: '视频删除失败',
        severity: 'error'
      });
    }
  };

  // 计算分析数据总和
  const calculateTotals = () => {
    if (!videoAnalytics || videoAnalytics.length === 0) {
      return { views: 0, likes: 0, comments: 0, shares: 0 };
    }
    
    return videoAnalytics.reduce((acc, item) => {
      return {
        views: acc.views + item.views,
        likes: acc.likes + item.likes,
        comments: acc.comments + item.comments,
        shares: acc.shares + item.shares
      };
    }, { views: 0, likes: 0, comments: 0, shares: 0 });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/videos')}
        >
          返回视频列表
        </Button>
      </Container>
    );
  }

  const totals = calculateTotals();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/videos')}
          sx={{ mb: 2 }}
        >
          返回视频列表
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          视频详情
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* 视频信息和编辑表单 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              基本信息
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="视频标题"
                  name="title"
                  value={video?.title || ''}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="视频描述"
                  name="description"
                  value={video?.description || ''}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">状态</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={video?.status || 'draft'}
                    label="状态"
                    onChange={handleChange}
                  >
                    <MenuItem value="draft">草稿</MenuItem>
                    <MenuItem value="published">已发布</MenuItem>
                    <MenuItem value="archived">已归档</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  创建时间: {new Date(video?.created_at).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  最后更新: {new Date(video?.updated_at).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '保存中...' : '保存更改'}
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                删除视频
              </Button>
            </Box>
          </Paper>

          {/* 视频预览区域 */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              视频预览
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {video && video.file_path ? (
              <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', bgcolor: '#000', mb: 3, borderRadius: 1, overflow: 'hidden' }}>
                <video
                  src={`http://localhost:5001${video.file_path}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                  controls
                  poster={`http://localhost:5001${video.thumbnail_path}`}
                />
              </Box>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  视频文件不可用
                </Typography>
              </Box>
            )}
            
            {/* 缩略图预览 */}
            {video && video.thumbnail_path && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  视频缩略图
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box 
                    sx={{ 
                      width: '200px',
                      height: '112px',
                      borderRadius: 1,
                      overflow: 'hidden',
                      bgcolor: '#f0f0f0',
                      backgroundImage: `url(http://localhost:5001${video.thumbnail_path})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    此缩略图将显示在视频列表和播放器加载时
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 分析数据 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              数据概览
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      总播放量
                    </Typography>
                    <Typography variant="h4">
                      {totals.views}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      总点赞数
                    </Typography>
                    <Typography variant="h4">
                      {totals.likes}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      总评论数
                    </Typography>
                    <Typography variant="h4">
                      {totals.comments}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      总分享数
                    </Typography>
                    <Typography variant="h4">
                      {totals.shares}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Button
              component="a"
              href={`/analytics?video=${id}`}
              fullWidth
              variant="outlined"
              color="primary"
              sx={{ mt: 3 }}
            >
              查看详细分析
            </Button>
          </Paper>

          {/* 近期数据 */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              近期数据
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {videoAnalytics.length > 0 ? (
              videoAnalytics.slice(0, 5).map((item, index) => (
                <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < 4 ? '1px solid #eee' : 'none' }}>
                  <Typography variant="subtitle2">
                    {new Date(item.date).toLocaleDateString()}
                  </Typography>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={3}>
                      <Typography variant="body2" color="textSecondary">
                        播放
                      </Typography>
                      <Typography variant="body1">
                        {item.views}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" color="textSecondary">
                        点赞
                      </Typography>
                      <Typography variant="body1">
                        {item.likes}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" color="textSecondary">
                        评论
                      </Typography>
                      <Typography variant="body1">
                        {item.comments}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" color="textSecondary">
                        分享
                      </Typography>
                      <Typography variant="body1">
                        {item.shares}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                暂无数据
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* 提示消息 */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 