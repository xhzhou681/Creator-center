const Video = require('../models/Video');
const User = require('../models/User');

// Get all videos (with pagination)
exports.getAllVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows: videos } = await Video.findAndCountAll({
      limit,
      offset,
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      }],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      videos,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalVideos: count
    });
  } catch (error) {
    console.error('Get all videos error:', error);
    res.status(500).json({ message: 'Error fetching videos', error: error.message });
  }
};

// Get video by ID
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      }]
    });
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.status(200).json({ video });
  } catch (error) {
    console.error('Get video by ID error:', error);
    res.status(500).json({ message: 'Error fetching video', error: error.message });
  }
};

// Create new video
exports.createVideo = async (req, res) => {
  try {
    const { title, description, video_url, thumbnail_url, status, metadata } = req.body;
    
    const video = await Video.create({
      title,
      description,
      video_url,
      thumbnail_url,
      status,
      metadata,
      user_id: req.userId
    });
    
    res.status(201).json({
      message: 'Video created successfully',
      video
    });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ message: 'Error creating video', error: error.message });
  }
};

// Update video
exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Check if user owns the video
    if (video.user_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this video' });
    }
    
    const { title, description, video_url, thumbnail_url, status, metadata } = req.body;
    
    await video.update({
      title,
      description,
      video_url,
      thumbnail_url,
      status,
      metadata,
      updated_at: new Date()
    });
    
    res.status(200).json({
      message: 'Video updated successfully',
      video
    });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Error updating video', error: error.message });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Check if user owns the video
    if (video.user_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }
    
    await video.destroy();
    
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Error deleting video', error: error.message });
  }
};

// Get videos by user ID
exports.getUserVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows: videos } = await Video.findAndCountAll({
      where: { user_id: req.params.userId },
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json({
      videos,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalVideos: count
    });
  } catch (error) {
    console.error('Get user videos error:', error);
    res.status(500).json({ message: 'Error fetching user videos', error: error.message });
  }
};