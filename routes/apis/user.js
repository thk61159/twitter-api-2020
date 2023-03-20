const express = require('express')
const router = express.Router()
const { apiErrorHandler } = require('../../middleware/error-handler')
const userController = require('../../controllers/user-controller')

router.post('/test-token', userController.userVerify)

router.use('/', apiErrorHandler)
module.exports = router
