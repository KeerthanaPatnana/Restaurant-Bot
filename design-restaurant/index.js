const readline = require('readline')


const express = require('express')
const dotEnv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const router = express.Router()
const prompt = require("prompt-sync")({ sigint: true });
const axios = require('axios');

const app = express()
const port = process.env.port || 5000


dotEnv.config()

//middleware
app.use(bodyParser.json())

//connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //console.log("MongoDB connected established")
    })
    .catch((error) => {
        console.log('Error', error)
    })

//routes    
const menuRoutes = require('./routes/menuRoutes')
app.use('/cuisine', menuRoutes)

const orderRoutes = require('./routes/orderRoutes')
app.use('/cuisine', orderRoutes)

//initialize readline interface
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

//Function to fetch menu items from the server
async function fetchMenuItems() {
    try {
        const repsonse = await axios.get('http://localhost:5000/cuisine/getMenu')
        return repsonse.data
    } catch(error) {
        console.log('Error fetching menu items:', error.message)
        return []
    }
}

//Function to fetch item details by ID
async function fetchItemById(itemId) {
    try {
        const repsonse = await axios.get(`http://localhost:5000/cuisine/getItemById/${itemId}`)
        return repsonse.data
    } catch (error) {
        console.log(`Error fetching item details for ID ${itemId}:`, error.message)
        return null
    }
}

async function createOrder(customerName, items) {
    try {
        await axios.post('http://localhost:5000/cuisine/createOrder',{
            customerName: customerName,
            orderItems: items
        }).then(response => {
               console.log('Response: ', response.data); 
        })
    } catch (error) {
        console.log(`Error fetching order details:`, error.message)
        return null
    }
}


//Function to handle user input
async function getUserInput() {
    const restaurantName = "Welcome to KB's cuisine"
    printRestaurantHeading(restaurantName)
    console.log('\n')
    console.log('             Menu Items:')
    console.log('------------------------------------')
    const menuItems = await fetchMenuItems();
    menuItems.forEach(element => {
        console.log(`${element.itemId}. ${element.itemName} - Rs.${element.price}`)
    });
    const customerName = await promptUser('\nEnter name: ');

    let items = []
    while(true) {
       const itemId = await promptUser('Enter item ID or type "checkout:" ');
        if (itemId === 'checkout') {
            console.log('Checking out........')
            /* console.log('Order:', items)
            console.log(customerName) */
            const orderDetails = createOrder(customerName, items)
            console.log(orderDetails)
            break
        } else {
            if (itemId) {
                const quantity = await promptUser('Enter Quantity: ');
                const item = {
                    itemId: parseInt(itemId),
                    quantity: parseInt(quantity) //convert to int
                }
                items.push(item)
            } else {
                console.log('Invalid item ID. Please try again');
            }
        }
    }
    r1.close()
}

//Function to prompt user input
function promptUser(promptText) {
    return new Promise((resolve)=>{
        r1.question(promptText, (answer) =>{
            resolve(answer)
        });
    })
}


function printRestaurantHeading(restaurantName) {
    const length = restaurantName.length + 26
    console.log("=".repeat(length))
    console.log("|           "+ restaurantName+ "             |")
    console.log("=".repeat(length))
}

//Start server
app.listen(port, ()=>{
    //console.log(`Server started and running at https://localhost:${port}`);
    getUserInput()
})