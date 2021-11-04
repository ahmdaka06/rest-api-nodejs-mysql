const express = require('express')
require('express-group-routes')
const routes = express.Router()

const {
    hasLogin,
    requireAuth
} = require('../middleware/auth')

// Controller
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

routes.group('/api/v1', (routes) => {
    // routes.get('/', (req, res) => {
    //     res.status(200).json({
    //         status: true,
    //         data: {
    //             message: 'Selamat datang di base api v1'
    //         }
    //     })
    // })
    
    // ROUTE AUTH
    routes.group('/auth', (routes) => {
        routes.post('/login', [hasLogin], authController.login)
        routes.post('/register', [hasLogin], authController.register)
    })
    // ROUTE AUTH
    routes.group('/user', (routes) => {
        routes.get('/profile', [requireAuth], userController.profile)
    })
    // ROUTE DEVICE

    // ROUTE USER
    // routes.group('/user', (routes) => {
    //     routes.post('/', [requireAuth], userController.index)
    // })

})
module.exports = routes