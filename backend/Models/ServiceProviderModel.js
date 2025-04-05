import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const ServiceProviderModel = sequelize.define('ServiceProvider', {
  provider_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  business_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  provider_type: {
    type: DataTypes.ENUM('mechanic', 'towing', 'fuel delivery', 'rental service'),
    allowNull: false
  },
  services_offered: {
    type: DataTypes.JSON,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: -180,
      max: 180
    }
  },
  contact_person: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      is: /^[0-9]+$/
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password_hash: {  // 🔥 Added password field
    type: DataTypes.STRING,
    allowNull: false
  },
  working_hours: {
    type: DataTypes.JSON,
    allowNull: true
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    }
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verification_documents: {
    type: DataTypes.JSON,
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
  tableName: 'service_providers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['provider_type']
    },
    {
      fields: ['is_verified']
    },
    {
      fields: ['latitude', 'longitude']
    }
  ]
});

export default ServiceProviderModel;
