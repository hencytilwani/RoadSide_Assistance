import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const VehicleModel = sequelize.define('Vehicle', {
  vehicle_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  make: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  model: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1900,
      max: 2100
    }
  },
  license_plate: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  vin_number: {
    type: DataTypes.STRING(17),
    allowNull: true,
    unique: true,
    validate: {
      len: [17, 17]
    }
  },
  obd2_compatible: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fuel_type: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  transmission_type: {
    type: DataTypes.STRING(30),
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
  tableName: 'vehicles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      unique: true,
      fields: ['vin_number']
    },
    {
      fields: ['license_plate']
    }
  ]
});

export default VehicleModel;