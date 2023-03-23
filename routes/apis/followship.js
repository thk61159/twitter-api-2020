const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/followship-controller.js')

router.post('/', followshipController.postFollowship)
router.get('/', followshipController.getFollowship)
router.delete('/:followingid', followshipController.deleteFollowship)

module.exports = router
