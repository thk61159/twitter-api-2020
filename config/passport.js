const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../models')
const passportJWT = require('passport-jwt')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, cb) => {
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) return cb('帳號不存在！', false) // 查詢不到user email有誤或帳號不存在！ // 找不到正確傳送錯誤訊息的方式QQ, 先直接寫在err參數裡
      const res = await bcrypt.compare(password, user.password)
      if (!res) return cb('email或密碼有誤!', false) // 密碼有誤
      return cb(null, user)// email 密碼都正確
    } catch (error) {
      cb(error)
    }
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const user = await User.findByPk(jwtPayload.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    cb(null, user)
  } catch (error) {
    cb(error)
  }
}))

module.exports = passport
