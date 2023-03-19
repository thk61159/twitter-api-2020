const router = require('express').Router()
const userController = require('../controllers/user-controller')
router.get('/', (req, res) => res.send('Hello World!'))

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

router.get('/users/tweets', userController.getUserTweets)
router.get('/users/:id/tweets', userController.getTweets)
router.get('/users/:id/replied_tweets', userController.getReplies)
router.get('/users/:id/likes', userController.getLikes)
router.get('/users/:id/followings', userController.getFollowings)
router.get('/users/:id/followers', userController.getFollowers)
router.get('/users/:id', userController.getUser)

module.exports = router
