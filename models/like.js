'use strict'
const env = process.env.NODE_ENV || 'development'
const databaseType = require('../config/config.json')[env].dialect
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate (models) {
      Like.belongsTo(models.User, { foreignKey: 'UserId' })
      Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    }
  }

  Like.init(
    databaseType === 'mysql'
      ? {
          UserId: DataTypes.INTEGER,
          TweetId: DataTypes.INTEGER
        }
      : {
          UserId: { type: DataTypes.INTEGER, field: 'User_id' },
          TweetId: { type: DataTypes.INTEGER, field: 'Tweet_id' }
        },
    {
      sequelize,
      paranoid: true,
      modelName: 'Like',
      tableName: 'Likes',
      underscored: true
    }
  )
  return Like
}
