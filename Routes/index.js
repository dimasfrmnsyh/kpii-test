const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/authController')
const SkillController = require('../Controllers/skillController')
const TrainingController = require('../Controllers/trainingController')

const {
    ensureToken,
} = require('../utils')
module.exports = function routes(app) {
    app.use('/v1', router)
//auth
    router.post('/user', ensureToken, AuthController.register)
    router.post('/auth/login', AuthController.login)
    router.get('/auth/logout',ensureToken,AuthController.logout)

//skill
    router.get('/skills',ensureToken,SkillController.getAll)
    router.post('/skills',ensureToken,SkillController.insert)


//training
    router.post('/activity',ensureToken,TrainingController.insert)
    router.put('/activity/:id',ensureToken,TrainingController.update)
    router.get('/activity',ensureToken,TrainingController.getAll)
    router.delete('/activity/:id',ensureToken,TrainingController.delete)

}