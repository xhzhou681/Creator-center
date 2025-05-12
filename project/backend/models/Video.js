const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  video_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  thumbnail_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'private'),
    defaultValue: 'draft'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'videos',
  timestamps: false
});

// Define association with User model
Video.belongsTo(User, { foreignKey: 'user_id', as: 'creator' });
User.hasMany(Video, { foreignKey: 'user_id', as: 'videos' });

module.exports = Video;