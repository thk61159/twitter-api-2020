const express = require('express')
const router = express.Router()
const passport = require('passport')
const { apiErrorHandler } = require('../../middleware/error-handler')
const userController = require('../../controllers/user-controller')

router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.use('/', apiErrorHandler)
module.exports = router
