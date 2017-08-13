var $j = $.noConflict()

function hexFromRGB (r, g, b) {
  var hex = [
    r.toString(16),
    g.toString(16),
    b.toString(16)
  ]
  $j.each(hex, function (nr, val) {
    if (val.length === 1) {
      hex[ nr ] = '0' + val
    }
  })
  return hex.join('').toUpperCase()
}

function sendHex () {
  var red = $j('#slider_red').slider('value')
  var green = $j('#slider_green').slider('value')
  var blue = $j('#slider_blue').slider('value')
  var hex = hexFromRGB(red, green, blue)
  console.log(hex)
  $j.get('/led/hex/' + hex, function () {})
}

(function () {
  $j('#slider_red, #slider_green, #slider_blue').slider({
    orientation: 'horizontal',
    range: 'min',
    max: 10,
    step: 1,
    value: 0,
    change: sendHex
  })

// UI EVENTS
  $j('#on_off_button').change(function () {
    $j.get('/button/' + $j(this).is(':checked'), function () {})
  })
})()
