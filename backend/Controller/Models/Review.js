import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/dbConnection.js';

const ReviewsRatingsModel = sequelize.define('ReviewsRatings', {
  review_id: {
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
  provider_id: {
    type: DataTypes.UUID,
    allowNull: false,
    // references: {
    //   model: 'providers',
    //   key: 'provider_id'
    // }
  },
  service_id: {
    type: DataTypes.UUID,
    allowNull: false,
    // references: {
    //   model: 'services',
    //   key: 'id'
    // }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  review_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  review_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  response_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  response_date: {
    type: DataTypes.DATE,
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
  tableName: 'reviews_ratings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['provider_id']
    },
    {
      fields: ['service_id']
    },
    {
      fields: ['rating']
    }
  ]
});

export default ReviewsRatingsModel;
