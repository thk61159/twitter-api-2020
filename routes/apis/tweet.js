const router = require('express').Router()
const tweetController = require('../../controllers/tweet-controller.js')
const upload = require('../../middleware/multer')

router.get('/tweets/', tweetController.getTweets)
router.post('/tweets', upload.single('image'), tweetController.postTweet)
router.get('/tweets/:tweet_id', tweetController.getTweet)
router.post('/:id/like', tweetController.like)
router.post('/:id/unlike', tweetController.unlike)

module.exports = router
