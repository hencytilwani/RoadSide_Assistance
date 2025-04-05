import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const VehicleMaintenanceRecordModel = sequelize.define('VehicleMaintenanceRecord', {
  record_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  vehicle_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  maintenance_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date_performed: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  mileage_at_service: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  service_provider: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  next_service_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  next_service_mileage: {
    type: DataTypes.INTEGER,
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
  tableName: 'vehicle_maintenance_records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['vehicle_id']
    },
    {
      fields: ['date_performed']
    },
    {
      fields: ['next_service_date']
    }
  ]
});

export default VehicleMaintenanceRecordModel;