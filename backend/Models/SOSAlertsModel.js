import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const SOSAlertsModel = sequelize.define('SOSAlerts', {
  sos_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  vehicle_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vehicles',
      key: 'vehicle_id'
    }
  },
  location_latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  location_longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
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
  alert_type: {
    type: DataTypes.ENUM('accident', 'breakdown', 'medical', 'security'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'resolved', 'false_alarm'),
    allowNull: false,
    defaultValue: 'active'
  },
  notified_contacts: {
    type: DataTypes.JSON,
    allowNull: true
  },
  notified_authorities: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  resolved_at: {
    type: DataTypes.DATE,
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
  tableName: 'sos_alerts',
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
      fields: ['timestamp']
    }
  ]
});

export default SOSAlertsModel;