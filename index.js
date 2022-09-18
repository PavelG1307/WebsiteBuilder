const express = require("express")
const http = require("http")
const builder = require('./routers/builder')
const fileupload = require('express-fileupload')

const port = 8080
const app = express()
const server = http.createServer(app)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(fileupload({ fileSize: 50 * 1024 * 1024 }))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('X-Robots-Tag', 'noindex')
  next()
})
app.use('/static', express.static('static'));
app.use('/api', builder)
app.use((error, req, res, next) => {
  console.log(error)
  console.log(error.message)
  res.status(400)
  res.json({
    success: false,
    message: req.app.get('env') === 'development' ? error.message : 'Неизвестная ошибка, обратитесь к администратору i@dxlebedev.ru'
  })
})

server.listen(port, () => console.log(`Сервер запущен на ${port} порту`))
