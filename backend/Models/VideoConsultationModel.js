import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const VideoConsultationModel = sequelize.define('VideoConsultation', {
  consultation_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  request_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  mechanic_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // Seconds
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  recording_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  diagnosis_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recommended_actions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'video_consultations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['request_id']
    },
    {
      fields: ['mechanic_id']
    },
    {
      fields: ['status']
    }
  ]
});

export default VideoConsultationModel;