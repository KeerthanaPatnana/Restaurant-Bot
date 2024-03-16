const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
    itemName: {
        type: String
    },
    price: {
        type: Number
    },
    itemId: {
        type: Number,
        required: true,
        unique: true
    }
})


module.exports = mongoose.model('Menu', menuSchema)