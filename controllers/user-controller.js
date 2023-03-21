const { User, Tweet, Followship, Reply, Like } = require('../models')
const { Op } = require('sequelize')
const { getUser } = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userControllerformerge = {
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id, {
        raw: true
      })
      user.tweetsCounts = await Tweet.count({ where: { UserId: id } })
      user.followersCounts = await Followship.count({
        where: { followingId: id }
      })
      user.followingsCounts = await Followship.count({
        where: { followerId: id }
      })
      user.currentUser = id === req.id
      return Promise.resolve(user)
        .then(user => res.status(200).json(user))
        .catch(err => next(err))
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      // const userId = req.user.id
      const userId = getUser(req).id || req.user.id
      const followings = await Followship.findAll({
        where: { followerId: userId },
        attributes: ['followingId'],
        raw: true
      })
      // Set可以拿掉 目前種子資料難以避免重複追蹤
      const showIds = [...new Set(followings.map(e => e.followingId))]
      showIds.push(userId)
      const tweets = await Tweet.findAll({
        where: { UserId: showIds },
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
      return Promise.resolve(result)
        .then(result => res.status(200).json(result))
        .catch(err => next(err))
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const UserId = req.params.id
      const tweets = await Tweet.findAll({
        where: { UserId },
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
      return Promise.resolve(result)
        .then(result => res.status(200).json(result))
        .catch(err => next(err))
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    // 之後或許需要使用者名稱跟帳號
    try {
      const UserId = req.params.id
      const replies = await Reply.findAll({
        where: { UserId },
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
        name: getUser(req).name || req.user.name,
        account: getUser(req).account || req.user.account
      }))
      return Promise.resolve(result)
        .then(result => res.status(200).json(result))
        .catch(err => next(err))
    } catch (err) {
      next(err)
    }
  },
  getLikes: async (req, res, next) => {
    try {
      const UserId = req.params.id
      let likes = await Like.findAll({
        where: { UserId },
        attributes: ['id'],
        order: [['createdAt', 'DESC']],
        raw: true
      })
      likes = likes.map(e => e.id)
      let likedTweets = await Tweet.findAll({
        where: { id: likes },
        include: { model: User, attributes: ['name', 'account'] },
        raw: true
      })
      likedTweets = likedTweets.map(e => {
        delete Object.assign(e, { TweetId: e.id }).id
        return e
      })
      return Promise.resolve(likedTweets)
        .then(likedTweets => res.status(200).json(likedTweets))
        .catch(err => next(err))
    } catch (err) {
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const { id } = req.params
      const followings = await User.findByPk(id, {
        include: [
          {
            model: User,
            as: 'Followings',
            attributes: ['id', 'name', 'avatar', 'introduction']
          }
        ]
      })
      // 使用者追蹤id資料，之後應該使用passport deserialize的使用者資料
      let currentUser = await User.findByPk(getUser(req).id, {
        include: [{ model: User, as: 'Followings', attributes: ['id'] }],
        attributes: ['id']
      })
      currentUser = currentUser.toJSON()
      // -----------------------------------------------------
      const result = followings.toJSON().Followings.map(e => {
        e = {
          ...e,
          currentfollowed: currentUser.Followings.some(
            element => element.id === e.id
          )
        }
        delete Object.assign(e, { followingId: e.id }).id
        return e
      })

      return Promise.resolve(result)
        .then(result => res.status(200).json(result))
        .catch(err => next(err))
    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const { id } = req.params
      const followers = await User.findByPk(id, {
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: ['id', 'name', 'avatar', 'introduction'],
            order: [['createdAt', 'DESC']]
          }
        ]
      })
      // 使用者追蹤id資料，之後應該使用passport deserialize的使用者資料
      let currentUser = await User.findByPk(getUser(req).id, {
        include: [{ model: User, as: 'Followings', attributes: ['id'] }],
        attributes: ['id']
      })
      currentUser = currentUser.toJSON()
      // -----------------------------------------------------
      const result = followers.toJSON().Followers.map(e => {
        e = {
          ...e,
          currentfollowed: currentUser.Followings.some(
            element => element.id === e.id
          )
        }
        delete Object.assign(e, { followerId: e.id }).id
        return e
      })
      return Promise.resolve(result)
        .then(result => res.status(200).json(result))
        .catch(err => next(err))
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { id } = req.params

      // 一個是number 一個是string 所以使用不嚴格的!=
      // if (id != req.params.id) throw new Error('401')
      const form = req.body
      const finalform = await userControllerformerge.formValidation(form, req)
      const user = await User.findByPk(id)
      const update = await user.update(finalform)
      return Promise.resolve(update)
        .then(update => res.status(200).json(update))
        .catch(err => next(err))
    } catch (err) {
      next(err)
    }
  },
  formValidation: async (form, req) => {
    const finalform = {}
    for (const key in form) {
      if (key === 'email') {
        if (!form[key]) throw new Error('此信箱不可為空')
        const countEmail = await User.findAndCountAll({
          where: { email: form[key], id: { [Op.notIn]: [getUser(req).id] } }
        })
        if (countEmail.count) throw new Error('此信箱已被使用')
      }
      if (key === 'account') {
        if (!form[key]) throw new Error('此帳號不可為空')
        const countAccount = await User.findAndCountAll({
          where: {
            account: form[key],
            id: { [Op.notIn]: [getUser(req).id] }
          }
        })
        if (countAccount.count) throw new Error('此帳號已被使用')
      }
      // 前端表格如果沒放檔案avatar, background會還傳空字串而不會出現在req.files
      if (key !== 'avatar' && key !== 'background') {
        finalform[key] = form[key]
      }
    }
    // 有表格而未上傳 req.files.name 是 undefind
    const files = req.files

    if (files) {
      if (files.avatar) {
        const avatarURL = await imgurFileHandler(files.avatar[0])
        finalform.avatar = avatarURL || getUser(req).avatar
      }
      if (files.background) {
        const backgroundURL = await imgurFileHandler(files.background[0])
        finalform.background = backgroundURL || getUser(req).background
      }
    }
    return finalform
  }
}
module.exports = { userControllerformerge }
