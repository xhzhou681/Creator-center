import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  FormHelperText,
  LinearProgress,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import videoService from '../services/videoService';

export default function VideoManagement() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 加载视频列表
  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await videoService.getUserVideos();
      setVideos(data);
    } catch (error) {
      console.error('Load videos error:', error);
      setError('加载视频列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  // 处理新视频表单变化
  const handleNewVideoChange = (e) => {
    setNewVideo({
      ...newVideo,
      [e.target.name]: e.target.value
    });
  };

  // 处理视频文件选择
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      
      // 创建视频预览URL
      const objectUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(objectUrl);
      
      // 清除缩略图
      setThumbnailUrl('');
      
      // 返回清理函数
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // 生成视频缩略图
  const generateThumbnail = () => {
    if (!videoRef.current || !videoPreviewUrl) return;
    
    setGeneratingThumbnail(true);
    
    // 确保视频已加载
    const video = videoRef.current;
    
    // 设置视频到中间位置以获取代表性的帧
    video.currentTime = video.duration / 2;
    
    // 当视频准备好当前帧时生成缩略图
    video.onseeked = () => {
      try {
        // 创建canvas
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // 绘制视频帧到canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // 将canvas转换为base64图片
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
        setThumbnailUrl(thumbnail);
      } catch (error) {
        console.error('Generate thumbnail error:', error);
        setSnackbar({
          open: true,
          message: '生成缩略图失败',
          severity: 'error'
        });
      } finally {
        setGeneratingThumbnail(false);
      }
    };
  };

  // 清除表单
  const clearForm = () => {
    setNewVideo({ title: '', description: '' });
    setVideoFile(null);
    setVideoPreviewUrl('');
    setThumbnailUrl('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 创建新视频
  const handleCreateVideo = async () => {
    try {
      setUploading(true);
      
      // 创建FormData对象
      const formData = new FormData();
      formData.append('title', newVideo.title);
      formData.append('description', newVideo.description);
      
      // 如果有视频文件，添加到FormData
      if (videoFile) {
        formData.append('video', videoFile);
      }
      
      // 如果有缩略图，添加到FormData
      if (thumbnailUrl) {
        // 将base64转换为Blob
        const thumbnailBlob = await fetch(thumbnailUrl).then(r => r.blob());
        formData.append('thumbnail', thumbnailBlob, 'thumbnail.jpg');
      }
      
      // 上传视频
      await videoService.createVideoWithFile(formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });
      
      setOpenNewDialog(false);
      clearForm();
      loadVideos(); // 重新加载视频列表
      
      setSnackbar({
        open: true,
        message: '视频创建成功',
        severity: 'success'
      });
    } catch (error) {
      console.error('Create video error:', error);
      setSnackbar({
        open: true,
        message: '视频创建失败',
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  // 删除视频
  const handleDeleteVideo = async () => {
    if (!selectedVideo) return;
    
    try {
      await videoService.deleteVideo(selectedVideo.id);
      setOpenDeleteDialog(false);
      loadVideos(); // 重新加载视频列表
      
      setSnackbar({
        open: true,
        message: '视频删除成功',
        severity: 'success'
      });
    } catch (error) {
      console.error('Delete video error:', error);
      setSnackbar({
        open: true,
        message: '视频删除失败',
        severity: 'error'
      });
    }
  };

  // 显示视频状态
  const renderStatus = (status) => {
    switch (status) {
      case 'published':
        return <Chip label="已发布" color="success" size="small" />;
      case 'draft':
        return <Chip label="草稿" color="default" size="small" />;
      case 'archived':
        return <Chip label="已归档" color="secondary" size="small" />;
      default:
        return <Chip label="未知" size="small" />;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          视频管理
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => setOpenNewDialog(true)}
        >
          创建新视频
        </Button>
      </Box>

      {error && (
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#ffebee' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {/* 视频列表 */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : videos.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                您还没有上传任何视频
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={() => setOpenNewDialog(true)}
                sx={{ mt: 2 }}
              >
                创建第一个视频
              </Button>
            </Box>
          ) : (
            <Table stickyHeader aria-label="视频列表">
              <TableHead>
                <TableRow>
                  <TableCell>标题</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>创建日期</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id} hover>
                    <TableCell>{video.title}</TableCell>
                    <TableCell>{renderStatus(video.status)}</TableCell>
                    <TableCell>
                      {new Date(video.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        component={Link} 
                        to={`/videos/${video.id}`}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        component={Link} 
                        to={`/videos/${video.id}`}
                        color="primary"
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => {
                          setSelectedVideo(video);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      {/* 创建新视频对话框 */}
      <Dialog open={openNewDialog} onClose={() => !uploading && setOpenNewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>创建新视频</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            请输入新视频的信息并上传视频文件。
          </DialogContentText>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                margin="dense"
                name="title"
                label="视频标题"
                type="text"
                fullWidth
                variant="outlined"
                value={newVideo.title}
                onChange={handleNewVideoChange}
                sx={{ mb: 2 }}
                disabled={uploading}
              />
              <TextField
                margin="dense"
                name="description"
                label="视频描述"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={newVideo.description}
                onChange={handleNewVideoChange}
                sx={{ mb: 3 }}
                disabled={uploading}
              />
              
              {/* 视频上传区域 */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <input
                  accept="video/*"
                  style={{ display: 'none' }}
                  id="video-upload-button"
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  disabled={uploading}
                />
                <label htmlFor="video-upload-button">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{ py: 1.5 }}
                    disabled={uploading}
                  >
                    选择视频文件
                  </Button>
                </label>
                {videoFile && (
                  <FormHelperText>
                    已选择: {videoFile.name} ({Math.round(videoFile.size / 1024 / 1024 * 100) / 100} MB)
                  </FormHelperText>
                )}
              </FormControl>
              
              {/* 生成缩略图按钮 */}
              {videoPreviewUrl && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<PhotoCameraIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                  onClick={generateThumbnail}
                  disabled={uploading || generatingThumbnail || !videoPreviewUrl}
                >
                  {generatingThumbnail ? '生成中...' : '生成视频缩略图'}
                </Button>
              )}
              
              {uploading && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    上传中... {uploadProgress}%
                  </Typography>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              {/* 视频预览区域 */}
              {videoPreviewUrl && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    视频预览
                  </Typography>
                  <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', bgcolor: '#000' }}>
                    <video
                      ref={videoRef}
                      src={videoPreviewUrl}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                      controls
                    />
                  </Box>
                </Box>
              )}
              
              {/* 缩略图预览区域 */}
              {thumbnailUrl && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    缩略图预览
                  </Typography>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      pt: '56.25%', 
                      position: 'relative',
                      bgcolor: '#f0f0f0',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={thumbnailUrl}
                      alt="视频缩略图"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewDialog(false)} disabled={uploading}>取消</Button>
          <Button 
            onClick={handleCreateVideo} 
            variant="contained"
            color="primary"
            disabled={!newVideo.title.trim() || !videoFile || uploading}
          >
            {uploading ? '上传中...' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除视频确认对话框 */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            您确定要删除视频 "{selectedVideo?.title}" 吗？此操作无法撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>取消</Button>
          <Button onClick={handleDeleteVideo} color="error">
            删除
          </Button>
        </DialogActions>
      </Dialog>

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