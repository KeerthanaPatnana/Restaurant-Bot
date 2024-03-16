const express = require('express')
const router = express.Router()

const orderController = require('../controllers/orderController')

router.post('/createOrder', orderController.createOrder)
router.get('/getOrder', orderController.getOrder)


module.exports = router