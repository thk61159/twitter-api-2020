const { User, Tweet, Followship, Reply, Like } = require('../models')
const userController = {
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id, {
        raw: true
      })
      user.tweetsCounts = await Tweet.count({ where: { userId: id } })
      user.followersCounts = await Followship.count({ where: { followingId: id } })
      user.followingsCounts = await Followship.count({ where: { followerId: id } })
      user.currentUser = id === req.id
      const response = {
        data: user
      }
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
