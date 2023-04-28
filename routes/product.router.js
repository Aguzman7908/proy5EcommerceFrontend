const express = require('express')
const {getProducts, getProductIndividual} = require ('../controllers/products.controllers')
const router = express.Router()

router.get('/',getProducts)

router.get('/:sku',getProductIndividual)

module.exports = router