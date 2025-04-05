import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const BreakdownRequestModel = sequelize.define('BreakdownRequest', {
  request_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  vehicle_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  request_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location_latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: -90,
      max: 90
    }
  },
  location_longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: -180,
      max: 180
    }
  },
  location_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  is_emergency: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ai_diagnosis_result: {
    type: DataTypes.JSON,
    allowNull: true
  },
  self_repair_attempted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  tableName: 'breakdown_requests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['vehicle_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['is_emergency']
    },
    {
      fields: ['location_latitude', 'location_longitude']
    }
  ]
});

export default BreakdownRequestModel;