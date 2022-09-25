const express = require("express")
const app = express()
const path = require('path')

app.use(async (req, res, next) => {
    const id = req.hostname.split('.')[0]
    if(id) {
        express.static(path.join(__dirname, 'static', id))(req, res, next)
    } else {
        next()
    }
})

module.exports = app