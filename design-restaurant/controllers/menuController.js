const Menu = require('../models/Menu')

const createMenu = async(req,res) => {
    try {
        const {itemName, price, itemId} = req.body
        const menu = new Menu({
            itemName,
            price,
            itemId
        })

    await menu.save()
    res.status(200).json(menu)
    } catch(error) {
        console.log("There is an error in server",error)
        res.status(500).json({message:'Server error'})
    }
}

const getMenu = async(req, res) => {
    try{
        //getAll
        const menu = await Menu.find()
        res.status(200).json(menu)
    }catch(error) {
        console.log("There is an error in server", error)
        res.status(500).json({ message: 'Server error' })
    }
}

const getItemByID = async(req,res) => {
    try{
        const itemName = await Menu.findOne({itemId: req.params.itemId})
        if(itemName) {
            res.status(200).json(itemName)
        } else {
            res.status(400).json({message: 'Item not found'})
        }
    } catch (error) {
        console.log("There is an error in server", error)
        res.status(500).json({ message: 'Server error' })
    }
}


module.exports = { createMenu, getMenu, getItemByID }