const express = require('express')
const routes = express.Router()

// Static routes
const api = require('./api')

routes.use(api)

module.exports = routes