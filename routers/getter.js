const express = require('express')
const router = express.Router()
const getter = require('../controllers/getter')

router.get('/', getter('get'))
module.exports = router