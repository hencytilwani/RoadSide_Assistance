import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const SystemLogsModel = sequelize.define('SystemLogs', {
  log_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  log_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  severity_level: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  related_entity_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  related_entity_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'system_logs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      fields: ['timestamp']
    },
    {
      fields: ['log_type']
    },
    {
      fields: ['severity_level']
    },
    {
      fields: ['related_entity_type', 'related_entity_id']
    }
  ]
});

export default SystemLogsModel;