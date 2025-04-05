import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const InsuranceClaimsModel = sequelize.define('InsuranceClaims', {
  claim_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  vehicle_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vehicles',
      key: 'vehicle_id'
    }
  },
  insurance_company: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  policy_number: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  incident_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  damage_assessment: {
    type: DataTypes.JSON,
    allowNull: true
  },
  claim_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  supporting_documents: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'processing', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'draft'
  },
  ai_assessment_result: {
    type: DataTypes.JSON,
    allowNull: true
  },
  approved_amount: {
    type: DataTypes.DECIMAL(10, 2),
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
  tableName: 'insurance_claims',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['vehicle_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['incident_date']
    }
  ]
});

export default InsuranceClaimsModel;