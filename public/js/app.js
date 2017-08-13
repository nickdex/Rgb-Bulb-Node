(function () {
  $('#slider_red, #slider_green, #slider_blue').slider({
    orientation: 'horizontal',
    range: 'min',
    max: 10,
    step: 1,
    value: 0
  })

// UI EVENTS
  $('#on_off_button').change(function () {
    $.get('/button/' + $(this).is(':checked'), function () {})
  })

  $('#slider_red').slider({change: function (event, ui) {
    var redValue = $('#slider_red').slider('value')
    $.get('/led/red/' + redValue, function () {})
  }})

  $('#slider_green').slider({change: function (event, ui) {
    var greenValue = $('#slider_green').slider('value')
    $.get('/led/green/' + greenValue, function () {})
  }})

  $('#slider_blue').slider({change: function (event, ui) {
    var blueValue = $('#slider_blue').slider('value')
    $.get('/led/blue/' + blueValue, function () {})
  }})
})()
