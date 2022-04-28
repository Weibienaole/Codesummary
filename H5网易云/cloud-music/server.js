const express = require('express')
const compression = require('compression')

const port = 8888
const app = express()

// 开启gzip压缩
app.use(compression())
app.use(express.static('./build'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
