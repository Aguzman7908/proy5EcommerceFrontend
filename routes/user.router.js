/* Importing the express module and creating an instance of it. */
const express = require('express')
const { getUsuario, createUsuario, updateUsuario, loginUser, verifyUser } = require('../controllers/users.controllers')
const router = express.Router()

const auth = require('../middlewares/authorization')

router.get('/obtener', auth, getUsuario)


router.post('/crear', createUsuario)

router.put('/actualizar', updateUsuario)

router.post('/login', loginUser)

router.post('/verificar', auth, verifyUser)



module.exports = router
