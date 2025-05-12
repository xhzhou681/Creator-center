const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.get('/user/:userId', videoController.getUserVideos);

// Protected routes (require authentication)
router.post('/', authMiddleware, videoController.createVideo);
router.put('/:id', authMiddleware, videoController.updateVideo);
router.delete('/:id', authMiddleware, videoController.deleteVideo);

module.exports = router;