'use strict'
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
		{
			UserId: { type: DataTypes.INTEGER, field: 'User_id' },
			TweetId: { type: DataTypes.INTEGER, field: 'Tweet_id' },
		},
		{
			sequelize,
			paranoid: true,
			modelName: 'Like',
			tableName: 'Likes',
			underscored: true,
		}
	)
  return Like
}
