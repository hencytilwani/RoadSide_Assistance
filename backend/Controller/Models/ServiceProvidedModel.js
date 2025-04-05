import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const ServiceProvidedModel = sequelize.define('ServiceProvided', {
  service_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  assignment_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  service_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parts_used: {
    type: DataTypes.JSON,
    allowNull: true
  },
  labor_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  parts_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  additional_charges: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  total_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  warranty_information: {
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
  tableName: 'services_provided',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['assignment_id']
    },
    {
      fields: ['service_type']
    }
  ]
});

export default ServiceProvidedModel;