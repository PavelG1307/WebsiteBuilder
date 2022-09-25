const express = require("express")
const http = require("http")
const vhost  = require('vhost')
const getSite = require('./getSite')
const createSite = require('./createSite')

const port = 8080
const app = express()
const server = http.createServer(app)

app.use(vhost("create.*", createSite));
app.use(vhost("*.*", getSite));

server.listen(port, () => console.log(`Сервер запущен на ${port} порту`))
