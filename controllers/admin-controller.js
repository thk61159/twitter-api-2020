const { getUser } = require('../_helpers')
const jwt = require('jsonwebtoken')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password
      if (userData.role === 'user') return res.json({ status: 'error', message: '帳號不存在！' })
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signInFail: (error, req, res, next) => {
    return res.status(401).send({ status: 'error', error, reason: req.session.messages })
  }
}
module.exports = adminController
