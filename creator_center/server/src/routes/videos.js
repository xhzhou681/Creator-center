const express = require('express');
const { 
  getUserVideos, 
  getVideo, 
  createVideo, 
  updateVideo, 
  deleteVideo,
  uploadVideo 
} = require('../controllers/videos');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads/videos');
const thumbnailDir = path.join(__dirname, '../../uploads/thumbnails');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 根据字段名选择不同的目录
    if (file.fieldname === 'thumbnail') {
      cb(null, thumbnailDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    
    // 根据字段名生成不同的文件名前缀
    if (file.fieldname === 'thumbnail') {
      cb(null, `thumbnail-${uniqueSuffix}${ext}`);
    } else {
      cb(null, `video-${uniqueSuffix}${ext}`);
    }
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    // 只接受视频文件
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传视频文件!'), false);
    }
  } else if (file.fieldname === 'thumbnail') {
    // 只接受图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('缩略图只允许上传图片文件!'), false);
    }
  } else {
    cb(new Error('未知的文件字段!'), false);
  }
};

// 创建multer实例
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024 // 限制文件大小为200MB
  }
});

// 创建上传中间件
const uploadFields = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

const router = express.Router();

// 所有视频路由都需要认证
router.use(auth);

// 获取用户的所有视频
router.get('/', getUserVideos);

// 获取单个视频详情
router.get('/:id', getVideo);

// 创建新视频
router.post('/', createVideo);

// 上传视频
router.post('/upload', uploadFields, uploadVideo);

// 更新视频
router.put('/:id', updateVideo);

// 删除视频
router.delete('/:id', deleteVideo);

module.exports = router; 