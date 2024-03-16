const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerName: String,
    items:[{
        menuItem: {
            type: String,
        ref: 'Menu'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    totalPrice: Number,
    orderDate : {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Order', orderSchema)