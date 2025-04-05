import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const VehicleDiagnosticDataModel = sequelize.define('VehicleDiagnosticData', {
  diagnostic_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  vehicle_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  obd2_data: {
    type: DataTypes.JSON,
    allowNull: true
  },
  engine_status: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  battery_level: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  oil_level: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  coolant_temperature: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  fuel_level: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  tire_pressure: {
    type: DataTypes.JSON,
    allowNull: true
  },
  error_codes: {
    type: DataTypes.JSON,
    allowNull: true
  },
  severity_level: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'vehicle_diagnostic_data',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      fields: ['vehicle_id']
    },
    {
      fields: ['timestamp']
    },
    {
      fields: ['severity_level']
    }
  ]
});

export default VehicleDiagnosticDataModel;