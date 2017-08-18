const PubNub = require('pubnub')
const config = require('../config.js')

var settings = {
  channel: 'pi-house',
  publish_key: config.pub_key,
  subscribe_key: config.sub_key
}

var pubnub = new PubNub(settings)

// return JSON object according to schema mirrored by Pi program
function packData (type, data) {
  return {
    type: type,
    value: data
  }
}

function pubnubUpdate (data) {
  pubnub.publish({
    channel: settings.channel,
    message: data
  }, function (status, res) {
    if (status.error) {
      console.log(status)
    }
  })
}

// rgb is a json object containing r/g/b/ values in 0-255 range
function publishRGB (rgb) {
  pubnubUpdate(packData('rgb', rgb))
  return 200
}

// Only accepts color in valid hex, and coverts it to RGB
function publishHex (hexValue) {
  var rgb = {
    red: 0,
    green: 0,
    blue: 0
  }
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue)
  if (result) {
    rgb = {
      red: parseInt(result[1], 16),
      green: parseInt(result[2], 16),
      blue: parseInt(result[3], 16)
    }
    return publishRGB(rgb)
  } else {
    console.error('Invalid Hex value, try again')
    return 400
  }
}

// led can be red, green or blue, brightValue is range 0-10
function publishLedBrightness (led, brightValue) {
  var rgb = {}
  var colors = ['red', 'green', 'blue']
  for (var i in colors) {
    if (colors.hasOwnProperty(i)) {
      rgb[colors[i]] = (led === colors[i]) ? Math.round(brightValue * 255 / 10) : 0
    } else {
      return 500
    }
  }
  return publishRGB(rgb)
}

// only works on single button right now
function publishButton (buttonId, value) {
  // Raspberry pi checks for a single button right now for id is not required
  pubnubUpdate(packData('button', value))
  return 200
}

module.exports = {
  publishColor: function (type, data) {
    switch (type) {
      case 'rgb':
        // data is rgb dictionary
        return publishRGB(data)
      case 'hex':
        // data has single value; color in hex
        return publishHex(data)
      case 'led':
        // data has color and value
        return publishLedBrightness(data['color'], data['value'])
      case 'button':
       // data has id and value
        return publishButton(data['id'], data['value'])
      default:
        console.log('Input type not recognized\n Use hex, led or button')
        return 400
    }
  }
}
