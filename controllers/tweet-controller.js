const { ReqError, AuthError, AutherError } = require('../helpers/errorInstance')
const { User, Tweet, Followship, Reply, Like } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { tryCatch } = require('../helpers/tryCatch')
const { getUser } = require('../_helpers')
// 其實是tweet才對但就先放這
const tweetController = {
  getTweet: tryCatch(async (req, res) => {
    const TweetId = req.params.tweet_id
    const tweet = await Tweet.findByPk(TweetId, {
      include: [
        {
          model: User,
          required: false,
          attributes: ['name', 'account', 'avatar'],
          as: 'poster'
        }
      ],
      raw: true
    })
    if (!tweet) throw new ReqError('此推文不存在')
    tweet.Replies = await Reply.count({ where: { TweetId } })
    tweet.Likes = await Like.count({ where: { TweetId } })
    res.send(tweet)
  }),
  postTweet: tryCatch(async (req, res) => {
    const userData = getUser(req).toJSON()
    const { description } = req.body
    const { file } = req
    const imageURL = file ? await imgurFileHandler(file) : null
    if (!description) throw new ReqError('推文不可為空')
    const result = await Tweet.create({
      UserId: userData.id,
      description,
      image: imageURL
    })
    return Promise.resolve(result)
      .then(result =>
        res.status(200).json(result.toJSON()))
  })
}
module.exports = tweetController
