var path = require('path')

var envFile = path.join(__dirname, '/env.json')
var jsonfile = require('jsonfile')

var envVars = jsonfile.readFileSync(envFile)

module.exports = {
  sub_key: envVars['sub_key'],
  pub_key: envVars['pub_key']
}
