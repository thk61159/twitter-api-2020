'use strict'
const faker = require('faker')
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
    for (let i = 0; i < 3; i++) {
      await queryInterface.bulkInsert('Replies',
        tweetsId.map(tweet => {
          const randomUserIndex = Math.floor(Math.random() * usersId.length)
          return {
            User_id: usersId[randomUserIndex].id,
            Tweet_id: tweet.id,
            comment: faker.lorem.sentence(5),
            created_at: new Date(),
            updated_at: new Date(),
            image: `https://loremflickr.com/320/240/?random=${Math.floor(Math.random() * 100)}`
          }
        })
      )
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
