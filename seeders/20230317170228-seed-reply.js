'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersId = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const tweetsId = await queryInterface.sequelize.query(
      'SELECT id FROM tweets;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    for (let i = 0; i < 3; i++) {
      await queryInterface.bulkInsert('Replies',
        tweetsId.map(tweet => {
          const randerUserIndex = Math.floor(Math.random() * usersId.length)
          return {
            User_id: usersId[randerUserIndex].id,
            Tweet_id: tweet.id,
            comment: faker.lorem.sentence(5),
            created_at: new Date(),
            updated_at: new Date(),
            image: `https://loremflickr.com/320/240/?random=${Math.random() * 100}`
          }
        })
      )
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Replies', {})
  }
}
