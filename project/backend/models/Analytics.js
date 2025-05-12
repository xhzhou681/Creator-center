const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Video = require('./Video');

const Analytics = sequelize.define('Analytics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  video_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'videos',
      key: 'id'
    }
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  shares: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  comments: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  watch_time_seconds: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  demographics: {
    type: DataTypes.JSON,
    allowNull: true
  },
  traffic_sources: {
    type: DataTypes.JSON,
    allowNull: true
  },
  date_recorded: {
    type: DataTypes.DATEONLY,
    allowNull: false
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
  tableName: 'video_analytics',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['video_id', 'date_recorded']
    }
  ]
});

// Define association with Video model
Analytics.belongsTo(Video, { foreignKey: 'video_id', as: 'video' });
Video.hasMany(Analytics, { foreignKey: 'video_id', as: 'analytics' });

module.exports = Analytics;