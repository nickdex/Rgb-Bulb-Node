var express = require('express')
var app = express()
var path = require('path')
const publicPath = path.join(__dirname, '/public')
const config = require(path.join(publicPath, 'config'))
const PubNub = require('pubnub')

var leds = {
  'red': 'led_red',
  'green': 'led_green',
  'blue': 'led_blue'
}

// Serve public content - basically any file in the public folder will be available on the server.
app.use(express.static(publicPath))

var settings = {
  channel: 'pi-house',
  publish_key: config.pub_key,
  subscribe_key: config.sub_key
}

var pubnub = new PubNub(settings)

function publishUpdate (data) {
  pubnub.publish({
    channel: settings.channel,
    message: data
  })
}

app.get('/led/:color/:value', function (req, res) {
  var ledColor = req.params.color
  if (!ledColor === 'hex') {
    var ledValue = req.params.value
    console.log('ledColor = ' + ledValue)

    if (!isNaN(parseInt(ledValue)) && leds.hasOwnProperty(ledColor)) {
      publishUpdate({item: leds[ledColor], brightness: ledValue})
      res.send('ok')
    } else {
      res.status(400).send('error')
    }
  } else {
    var hexValue = req.params.value
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue)
    var rgb = result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
    /* rgb contains brightness values for each color */
    publishUpdate({item: 'rgb', 'rgb': rgb})

    res.send('ok')
  }
})

app.get('/button/:value', function (req, res) {
  var buttonValue = req.params.value
  console.log('On-Off button = ' + buttonValue)

  if (buttonValue === 'true' | buttonValue === 'false') {
    publishUpdate({item: 'on_off_button', 'on': buttonValue})
    res.send('ok')
  } else {
    res.status(400).send('error')
  }
})

// viewed at http://localhost:8080
app.get('/', function (req, res) {
  res.sendFile(path.join(publicPath, '/index.html'))
})

app.listen(8080, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on port 8080`)
})
