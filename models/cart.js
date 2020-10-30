const mongoose = require('mongoose');
const StoreItems = require('./storeItems');


/*

const CartSchema = new mongoose.Schema(
    {
    items : [{
        productId :{
            type: mongoose.ObjectId,
            ref: 'Product',
            require: true
        },
        qty: Number

    }],
        totalPrice : Number

}
)

 */
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

// // CartSchema.methods.addToCart = async function(productId){
// //     const product = await StoreItems.findById({_id: productId});
// //     if (product){
// //         //const cart = User.cart;
// //         const isExisting = await this.items.find({_id : productId});
// //         if(isExisting >= 0){
// //             this.items[isExisting].qty += 1;
// //         }else{
// //             this.items.push({productId: product._id, qty: 1});
// //         }
// //         if (!this.totalPrice){
// //             this.totalPrice = 0
// //         }
// //         this.totalPrice += product.price;
// //         this.save();
// //         return this;
// //     }
// // };
//

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
/*
module.exports = function Cart(){
    this.items = [{
            productId :{
                type: mongoose.ObjectId,
                ref: 'StoreItems'
            },
            qty: Number || 0
        }];
    this.totalPrice = Number || 0;

    this.add = function (item, id){
        let storeItem = this.items[id];
        if(!storeItem){
            storeItem = this.items[id]={productId: item._id, qty: 0, price:0};
        }
        storeItem.qty++;
        storeItem.price = storeItem.item.price * storeItem.qty;
        this.totalPrice+=storeItem.item.price;
    };
}*/
