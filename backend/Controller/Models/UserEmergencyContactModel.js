import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const UserEmergencyContactModel = sequelize.define('UserEmergencyContact', {
  contact_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      is: /^[0-9]+$/
    }
  },
  relationship: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  tableName: 'user_emergency_contacts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['phone_number']
    }
  ]
});

export default UserEmergencyContactModel;