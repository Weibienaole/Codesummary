const express = require('express')
const webpack = require('webpack')
const config = require('./webpack.config.js')
const complier = webpack(config)
const middle = require('webpack-dev-middleware')
let app = express()

app.use(middle(complier))

app.get('/api/user', ((rep,res) => {
  res.json({name: 'Monica'})
}))


app.listen(3500)