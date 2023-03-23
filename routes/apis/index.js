const router = require('express').Router()
const users = require('./user')
const admin = require('./admin')
const passport = require('passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const userController = require('../../controllers/user-controller')
const adminController = require('../../controllers/admin-controller')
const tweetController = require('../../controllers/tweet-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})
const upload = require('../../middleware/multer')

router.post('/users', userController.signUp)
router.post('/admin/login', passport.authenticate('local', { session: false, failureMessage: true, failWithError: true }), adminController.signIn, adminController.signInFail)
router.post('/users/login', passport.authenticate('local', { session: false, failureMessage: true, failWithError: true }), userController.signIn, userController.signInFail)

router.use(authenticated)
router.use('/admin', authenticatedAdmin, admin)
router.use('/users', users)
router.post('/tweets', upload.single('image'), tweetController.postTweet)
router.get('/tweets/:tweet_id', tweetController.getTweet)

router.use('/', apiErrorHandler)
module.exports = router
