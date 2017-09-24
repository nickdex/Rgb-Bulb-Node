var rgbColors = {
  'red': 0,
  'green': 0,
  'blue': 0
}

function mouseOverColor (hex) {
  document.getElementById('divpreview').style.visibility = 'visible'
  document.getElementById('divpreview').style.backgroundColor = hex
  document.body.style.cursor = 'pointer'
}

function mouseOutMap () {
  document.getElementById('divpreview').style.visibility = 'hidden'
  document.body.style.cursor = ''
}

function sendColor(color) {
  document.getElementById('led_indicator').style.backgroundColor = color
  var url = '/led/hex/' + color.substr(1)
  $.get(url)
}

function clickColor (hex) {
  sendColor(hex)
}

function decimalToHex (c) {
  var hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

function rgbToHex (rgb) {
  var r = rgb['red']
  var g = rgb['green']
  var b = rgb['blue']
  return '#' + decimalToHex(r) + decimalToHex(g) + decimalToHex(b)
}

function createSlider (sliderId, color) {
  var slider = document.getElementById(sliderId)
  // Fetch the slider with given id, and create a slider
  noUiSlider.create(slider, {
    start: [0],
    connect: 'lower',
    tooltips: [ wNumb({decimals: 0}) ],
    range: {
      'min': [0],
      'max': [10]
    },
    step: 1,
    format: wNumb({
      decimals: 0
    })
  })

  // Whenever slider values changes it will make POST request to node server
  slider.noUiSlider.on('slide', function (values, handle) {
    rgbColors[color] = Math.round(values[handle] * 255 / 10)
    sendColor(rgbToHex(rgbColors))
  })
}

$(document).ready(function () {
  var sliders = $('#slider_card .card-body .pmd-range-slider')
  for (var i in sliders) {
    if (sliders.hasOwnProperty(i) && !isNaN(i)) {
      var id = sliders[i].id
      createSlider(id, id.split('_')[1])
    }
  }
})
