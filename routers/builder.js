const express = require('express')
const router = express.Router()
const builder = require('../controllers/builder')

router.post('/create', builder('create'))

module.exports = router