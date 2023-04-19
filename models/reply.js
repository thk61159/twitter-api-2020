'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate (models) {
      Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
      Reply.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Reply.init(
		{
			comment: DataTypes.TEXT,
			UserId: { type: DataTypes.INTEGER, field: 'User_id' },
			TweetId: { type: DataTypes.INTEGER, field: 'Tweet_id' },
			image: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Reply',
			tableName: 'Replies',
			underscored: true,
		}
	)
  return Reply
}
