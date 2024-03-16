const Order = require('../models/Order')
const Menu = require('../models/Menu')

const createOrder = async (req, res) => {
    try {
        const { customerName, orderItems } = req.body
        let totalPrice = 0
        let items = []
        //calculate total price
        for (const orderItem of orderItems) {
            const menuItem = await Menu.findOne({ itemId: orderItem.itemId })
            totalPrice += menuItem.price * orderItem.quantity;
            items.push({menuItem: menuItem.itemName, quantity: orderItem.quantity})
        }

        //create new order
        const order = new Order({
            customerName,
            items,
            totalPrice
        })

        await order.save()
        const response = {
            message: 'Order placed successfully!',
            customerName: order.customerName,
            bill: order.items.map(item => {
                return {
                    menuItem: item.menuItem,
                    quantity: item.quantity
                }
            }),
            totalPrice: order.totalPrice
        }
        res.status(200).json(response)
    } catch (error) {
        console.log('Error', error)
        res.status(500).json({ message: 'Server error' })
    }
}

const getOrder = async (res, req) => {
    try {
        const order = await Order.find()
        res.status(200).json(order)
    } catch (error) {
        console.log('Error', error)
        res.status(500).json({ message: 'Server error' })
    }
}


module.exports = {createOrder, getOrder}