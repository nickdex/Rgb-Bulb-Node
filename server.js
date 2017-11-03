const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const pi = require('./led/pi.js')
const app = express()
const publicPath = path.join(__dirname, 'public')
const config = require('./config.js')

// Serve public content - basically any file in the public folder will be available on the server.
app.use(express.static(publicPath))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// DialogFlow Integration with Google Assistant
app.post('/agent', function (req, res) {
  console.log("Request\n");
  console.log(JSON.stringify(req));
  console.log("Response\n");
  console.log(JSON.stringify(res));
  res.send(200)
})

app.post('/led/rgb', function (req, res) {
  var rgb = req.body
  console.log(rgb)
  var response = pi.publishColor('rgb', rgb)
  res.send(response)
})

app.get('/led/hex/:value', function (req, res) {
  var hexValue = req.params.value
  var response = pi.publishColor('hex', hexValue)
  res.sendStatus(response)
})

// Single Led Brightness
app.get('/led/:color/:value', function (req, res) {
  var ledColor = req.params.color
  var brightValue = req.params.value
  var data = {color: ledColor, 'value': brightValue}
  var response = pi.publishColor('led', data)
  res.sendStatus(response)
})

app.get('/button/:value', function (req, res) {
  var buttonId = 'on_off_button'
  var buttonValue = req.params.value
  var response = pi.publishColor('button', {id: buttonId, 'value': buttonValue})
  res.send(response)
})

// viewed at http://localhost:8080 for development
app.get('/', function (req, res) {
  res.sendFile(path.join(publicPath, '/index.html'))
})

app.listen(config.port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log('server is listening on port ' + config.port)
})
