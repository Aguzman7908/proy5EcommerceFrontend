/* Importing the express module and creating an instance of it. */
const express = require('express')
const Usuario = require('../models/Usuario') // NUESTRO MODELO PARA PERMITIR GENERAR O MODIFICAR USUARIOS CON LA BASE DE DATOS
const bcryptjs = require('bcryptjs') // Para encriptar la contraseña
const jwt = require('jsonwebtoken')

const getUsuario = async (req, res) => {
	try {
		const usuarios = await Usuario.find({})
		res.json({ usuarios })
	} catch (error) {
		res.status(500).json({ msg: 'Hubo un error obteniendo los datos' })
	}
}

// CREAR UN USUARIO JWT
const createUsuario = async (req, res) => {
	const { username, email, password } = req.body // OBTENER USUARIO, EMAIL Y PASSWORD DE LA PETICIÓN

	// GENERAMOS STRING ALEATORIO PARA USARSE CON EL PASSWORD
	const salt = await bcryptjs.genSalt(10)
	const hashedPassword = await bcryptjs.hash(password, salt)

	try {
		// CREAMOS UN USUARIO CON SU PASSWORD ENCRIPTADO
		const nuevoUsuario = await Usuario.create({
			username,
			email,
			password:hashedPassword,
		})

		/* Con paylod vamos a acceder paylod*/
		const paylod ={
			user: {
				id:nuevoUsuario._id,
			},
		}

		//2. FIRMAR EL JWT
		jwt.sign(
			paylod, // DATOS QUE SE ACOMPAÑARAN  EN EL TOKEN
			process.env.SECRET, //LLAVE PARA DESCRIFRAR LA FIRMA ELECTRONICA DEL TOKEN,
			{
				expiresIn:36000. // EXPIRACION DEL TOKEN
			},
			(error, token) => {
				// CALLBACK QUE , EN CASO DE QUE EXISTA UN ERROR, DEVUELVA EL TOKEB
				if (error) throw error
					//res.json(nuevoUsuario)
					res.json({token})
			}
		)

		
		//res.json(nuevoUsuario)
	} catch (error) {
		return res.status(400).json({
			msg: error,
		})
	}
}

// INICIAR SESION
const loginUser =  async (req, res) =>{
	const {email, password} = req.body
	try{
		let foundUser = await Usuario.findOne({email:email}) // ENCONTRAMOS UN USUARIO
		if (!foundUser){
			return res.status(400).json({msg:'El usuario no existe'})
		}
		//Compara la evalucacion de la contraseña enviada con  el que esta en la base de datos
		const passCorrecto = await bcryptjs.compare(password, foundUser.password)
		// si el password es incorrecto regresa un mensje de password incorrecto
		if (!passCorrecto){
			return await res.status(400).json({msg:'Password incorrecto'})
		}
		const payload ={
			user:{
				id:foundUser.id,
			},
		}
		//2. FIRMA DEL JWT
		if (email && passCorrecto){
			jwt.sign(payload, process.env.SECRET, {expiresIn:360000}, (error, token) =>{
				if (error) throw error
				//SI TODO SUCEDIO CORRECTAMENTE, RETORNOAR EL TOKEN
				res.json({token})
			})
		}else {
			res.json({msg:'Hubo un error', error})
		}
	} catch (error){
		res.json({msg:'Hubo un error, error'})
	}
}

const verifyUser = async (req, res) => {
	try{
		//CONFIRMAMOS QUE EL USAURIO EXISTA EN BASE DE DATOS Y RETORNAMOS SUS DATOS, EXLUYENDO EL PASSWORD
		const usuario = await Usuario.findById(req.user.id).select('-password') // signo de menos significa que devuelva todo menos el campo de password
		res.json({usuario})
	} catch (error){
	res.status(500).json({msg: 'Hubo un error actualizando la Usuario',	error,})
 }
}

const updateUsuario = async (req, res) => {
	const { nombre, email } = req.body
	try {
		const actualizacionUsuario = await Usuario.findByIdAndUpdate(req.user.id, { nombre, email }, { new: true })
		res.json(actualizacionUsuario)
	} catch (error) {
		res.status(500).json({
			msg: 'Hubo un error actualizando la Usuario',
		})
	}
}

module.exports = { getUsuario, createUsuario, updateUsuario, verifyUser, loginUser }
