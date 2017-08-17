const path = require('path')
var config = {}
// development
var envPath = path.join(__dirname, 'env')
var env = process.env.NODE_ENV || 'development'
if (env === 'development') {
  config = require(path.join(envPath, 'development'))
} else if (env === 'test') {
  config = require(path.join(envPath, 'test'))
} else if (env === 'production') {
  config = require(path.join(envPath, 'production'))
}

module.exports = config
