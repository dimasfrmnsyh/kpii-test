const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/authController')
const {
    ensureToken,
} = require('../utils')
module.exports = function routes(app) {
    app.use('/v1', router)

    router.post('/user', ensureToken, AuthController.register)
    router.post('/login', AuthController.login)
}