const mongoose = require('mongoose');
const StoreItems = require('./storeItems');

const CartSchema =  new mongoose.Schema(
    {
        items : [{
            productId :{
                type: mongoose.ObjectId,
                ref: 'StoreItems'
            },
            qty: Number
        }],
        totalPrice : {type:Number}
    }
)

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;

