var express = require('express')
var app = express()
var path = require('path')

app.use(express.static(path.join(__dirname, '/public')))

// viewed at http://localhost:8080
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.listen(8080, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on \nhttp://192.168.0.159:8080`)
})
