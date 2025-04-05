import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const ServiceProviderMechanicModel = sequelize.define('ServiceProviderMechanic', {
  mechanic_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  provider_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  specialization: {
    type: DataTypes.JSON,
    allowNull: true
  },
  experience_years: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  certification_details: {
    type: DataTypes.JSON,
    allowNull: true
  },
  profile_image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  availability_status: {
    type: DataTypes.ENUM('available', 'busy', 'offline'),
    defaultValue: 'offline'
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
  tableName: 'service_provider_mechanics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['provider_id']
    },
    {
      fields: ['availability_status']
    }
  ]
});

export default ServiceProviderMechanicModel;