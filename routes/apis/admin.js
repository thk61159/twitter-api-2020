const express = require('express')
const router = express.Router()
const passport = require('passport')
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/api-auth')

router.post('/login', passport.authenticate('local', { session: false, failureMessage: true, failWithError: true }), adminController.signIn, adminController.signInFail)

module.exports = router
