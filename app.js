const express = require('express')
const helpers = require('./_helpers')
const methodOverride = require('method-override')
const routes = require('./routes')

const app = express()
const port = 3000
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
