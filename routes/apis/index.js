const router = require('express').Router()
const users = require('./user')
const admin = require('./admin')
const passport = require('passport')
const { authenticated } = require('../../middleware/api-auth')
const userController = require('../../controllers/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})
router.post('/users/', userController.signUp)
router.post('/users/test-token', userController.userVerify)
router.post(
  '/users/login',
  passport.authenticate('local', {
    session: false,
    failureMessage: true,
    failWithError: true
  }),
  userController.signIn,
  userController.signInFail
)

router.use('/users', authenticated, users)
router.use('/admin', admin)

router.use('/', apiErrorHandler)
module.exports = router
