import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const SubscriptionPlanModel = sequelize.define('SubscriptionPlan', {
  plan_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  billing_cycle: {
    type: DataTypes.ENUM('monthly', 'yearly'),
    allowNull: false
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true
  },
  max_free_towing_distance: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  priority_level: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  tableName: 'subscription_plans',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['is_active']
    },
    {
      fields: ['price']
    }
  ]
});

export default SubscriptionPlanModel;