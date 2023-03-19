const { User, Tweet, Followship, Reply, Like } = require('../models')
const userController = {
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id, {
        raw: true
      })
      user.tweetsCounts = await Tweet.count({ where: { userId: id } })
      user.followersCounts = await Followship.count({
        where: { followingId: id }
      })
      user.followingsCounts = await Followship.count({
        where: { followerId: id }
      })
      user.currentUser = id === req.id
      const response = {
        data: user
      }
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      // const userId = req.user.id
      const userId = req.user || 3
      const followings = await Followship.findAll({
        where: { followerId: userId },
        attributes: ['followingId'],
        raw: true
      })
      // Set可以拿掉 目前種子資料難以避免重複追蹤
      const showIds = [...new Set(followings.map(e => e.followingId))]
      showIds.push(userId)
      const tweets = await Tweet.findAll({
        where: { userId: showIds },
        include: [
          { model: User, attributes: ['name', 'account'] },
          { model: Reply },
          { model: Like }
        ],
        order: [['createdAt', 'DESC']], // or ['id', 'DESC'] 因為理論上id越後面越新
        nest: true
      })
      const result = tweets.map(e => {
        const temp = e.toJSON()
        temp.Replies = temp.Replies.length
        temp.Likes = temp.Likes.length
        return temp
      })
      const response = {
        data: result
      }
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const tweets = await Tweet.findAll({
        where: { userId },
        include: [{ model: Reply }, { model: Like }],
        order: [['createdAt', 'DESC']],
        nest: true
      })
      const result = tweets.map(e => {
        const temp = e.toJSON()
        temp.Replies = temp.Replies.length
        temp.Likes = temp.Likes.length
        return temp
      })
      const response = {
        data: result
      }
      res.status(200).json(response)
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    // 之後或許需要使用者名稱跟帳號
    try {
      const userId = req.params.id
      const replies = await Reply.findAll({
        where: { userId },
        include: {
          model: Tweet,
          attributes: ['id'],
          include: { model: User, attributes: ['account'] }
        },
        order: [['createdAt', 'DESC']],
        raw: true
      })
      const result = replies.map(e => ({
        ...e,
        name: req.user || 'just an example',
        account: req.user || 'just an example'
      }))

      const response = {
        data: result
      }
      res.status(200).json(response)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getLikes: async (req, res, next) => {
    try {
      const userId = req.params.id
      let likes = await Like.findAll({
        where: { userId },
        attributes: ['id'],
        order: [['createdAt', 'DESC']],
        raw: true
      })
      likes = likes.map(e => e.id)
      const likedTweets = await Tweet.findAll({
        where: { id: likes },
        include: { model: User, attributes: ['name', 'account'] },
        raw: true
      })
      const response = {
        data: likedTweets
      }
      res.status(200).json(response)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}
module.exports = userController
