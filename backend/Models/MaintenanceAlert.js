import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const PredictiveMaintenanceAlertsModel = sequelize.define('PredictiveMaintenanceAlerts', {
  alert_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  vehicle_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vehicles',
      key: 'vehicle_id'
    }
  },
  alert_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  predicted_failure_component: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  recommended_action: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  predicted_failure_timeframe: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  confidence_score: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 1
    }
  },
  is_dismissed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
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
  tableName: 'predictive_maintenance_alerts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['vehicle_id']
    },
    {
      fields: ['severity']
    },
    {
      fields: ['is_dismissed']
    }
  ]
});

export default PredictiveMaintenanceAlertsModel;