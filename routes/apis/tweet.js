const express = require('express')
const router = express.Router()
const tweetController = require('../../controllers/tweet-controller.js')

router.post('/:tweetId/like', tweetController.like)
router.post('/:tweetId/unlike', tweetController.unlike)
router.get('/:tweetId/replies', tweetController.getReplies)
router.post('/:tweetId/replies', tweetController.postReplies)

module.exports = router
