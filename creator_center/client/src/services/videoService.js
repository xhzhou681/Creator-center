import api from './api';

// 获取用户的所有视频
const getUserVideos = async () => {
  return await api.get('/videos');
};

// 获取单个视频详情
const getVideo = async (id) => {
  return await api.get(`/videos/${id}`);
};

// 创建新视频
const createVideo = async (videoData) => {
  return await api.post('/videos', videoData);
};

// 创建新视频并上传文件
const createVideoWithFile = async (formData, onUploadProgress) => {
  return await api.post('/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  });
};

// 更新视频
const updateVideo = async (id, videoData) => {
  return await api.put(`/videos/${id}`, videoData);
};

// 删除视频
const deleteVideo = async (id) => {
  return await api.delete(`/videos/${id}`);
};

const videoService = {
  getUserVideos,
  getVideo,
  createVideo,
  createVideoWithFile,
  updateVideo,
  deleteVideo
};

export default videoService; 