const mongoose = require('mongoose');
const StoreItems = require("../models/storeItems");


const UserSchema = new mongoose.Schema(
    {
        firstName : String,
        lastName : String,
        email: String,
        cart:[{type: mongoose.ObjectId, ref: 'Cart'}]

    }
 )



// UserSchema.methods.addToCart = async function(productId){
//     const product = await StoreItems.findById({_id: productId});
//     if (product){
//         const cart = User.cart;
//         const isExisting = cart.items.find({_id : productId});
//         if(isExisting >= 0){
//             cart.items[isExisting].qty += 1;
//         }else{
//             cart.items.push({productId: product._id, qty: 1});
//         }
//         if (!cart.totalPrice){
//             cart.totalPrice = 0
//         }
//         cart.totalPrice += product.price;
//         cart.save();
//         return cart;
//     }
// };
//
//
// User.methods.removeFromCart = function(productId) {
//     const cart = User.cart;
//     const isExisting = cart.items.find({_id : productId} );
//     if (isExisting >= 0) {
//         cart.items.splice(isExisting, 1);
//         return cart;
//     }
// }

const User = mongoose.model('User', UserSchema);

module.exports = User;
