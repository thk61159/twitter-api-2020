'use strict'
const { User, Tweet } = require('../models')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersId = await User.findAll({
			where: { role: 'user' },
			attributes: ['id'],
		})
		const tweetsId = await Tweet.findAll({
			attributes: ['id'],
		})

    await queryInterface.bulkInsert(
      'Likes',
      Array.from({ length: 50 }, (_, i) => {
        return {
          User_id: usersId[Math.floor(Math.random() * usersId.length)].id,
          Tweet_id: tweetsId[Math.floor(Math.random() * tweetsId.length)].id,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Likes', {})
  }
}
