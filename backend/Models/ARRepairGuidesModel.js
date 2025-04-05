import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const ARRepairGuidesModel = sequelize.define('ARRepairGuides', {
  guide_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  vehicle_make: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  vehicle_model: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  year_range: {
    type: DataTypes.JSON,
    allowNull: false
  },
  repair_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  difficulty_level: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  estimated_time: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  steps: {
    type: DataTypes.JSON,
    allowNull: false
  },
  required_tools: {
    type: DataTypes.JSON,
    allowNull: false
  },
  safety_warnings: {
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
  tableName: 'ar_repair_guides',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['vehicle_make', 'vehicle_model']
    },
    {
      fields: ['repair_type']
    }
  ]
});

export default ARRepairGuidesModel;