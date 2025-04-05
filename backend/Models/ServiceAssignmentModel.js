import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const ServiceAssignmentModel = sequelize.define('ServiceAssignment', {
  assignment_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  request_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  provider_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  mechanic_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  assigned_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  estimated_arrival_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actual_arrival_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('assigned', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'assigned'
  },
  estimated_service_duration: {
    type: DataTypes.INTEGER, // Minutes
    allowNull: true
  },
  actual_service_duration: {
    type: DataTypes.INTEGER, // Minutes
    allowNull: true
  },
  distance_to_customer: {
    type: DataTypes.FLOAT, // Kilometers
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
  tableName: 'service_assignments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['request_id']
    },
    {
      fields: ['provider_id']
    },
    {
      fields: ['mechanic_id']
    },
    {
      fields: ['status']
    }
  ]
});

export default ServiceAssignmentModel;