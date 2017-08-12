(function () {
  var settings = {
    channel: 'pi-house',
    publish_key: config.pub_key,
    subscribe_key: config.sub_key
  }

  var pubnub = PUBNUB(settings)

  var door = document.getElementById('door')
  var ledRed = document.getElementById('ledRed')
  var ledGreen = document.getElementById('ledGreen')
  var ledBlue = document.getElementById('ledBlue')

  pubnub.subscribe({
    channel: settings.channel,
    callback: function (m) {
      if (m.temperature) {
        document.querySelector('[data-temperature]').dataset.temperature = m.temperature
      }
      if (m.humidity) {
        document.querySelector('[data-humidity]').dataset.humidity = m.humidity
      }
    }
  })

  function publishUpdate (data) {
    pubnub.publish({
      channel: settings.channel,
      message: data
    })
  }

// UI EVENTS

  door.addEventListener('change', function (e) {
    publishUpdate({item: 'door', open: this.checked})
  }, false)

  ledRed.addEventListener('change', function (e) {
    publishUpdate({item: 'led_red', brightness: +this.value})
  }, false)

  ledGreen.addEventListener('change', function (e) {
    publishUpdate({item: 'led_green', brightness: +this.value})
  }, false)

  ledBlue.addEventListener('change', function (e) {
    publishUpdate({item: 'led_blue', brightness: +this.value})
  }, false)
})()
