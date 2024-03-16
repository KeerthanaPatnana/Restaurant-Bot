const express = require('express')

const router = express.Router()
const menuController = require('../controllers/menuController')



router.post('/addMenuItems', menuController.createMenu)
router.get('/getMenu', menuController.getMenu)
router.get('/getItemById/:itemId', menuController.getItemByID)


module.exports = router