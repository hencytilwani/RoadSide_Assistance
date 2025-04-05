import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const SparePartsInventoryModel = sequelize.define('SparePartsInventory', {
  part_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  compatible_makes: {
    type: DataTypes.JSON,
    allowNull: false
  },
  compatible_models: {
    type: DataTypes.JSON,
    allowNull: false
  },
  compatible_years: {
    type: DataTypes.JSON,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  supplier_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  specifications: {
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
  tableName: 'spare_parts_inventory',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['name']
    },
    {
      fields: ['stock_quantity']
    }
  ]
});

export default SparePartsInventoryModel;
