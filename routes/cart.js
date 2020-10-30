
const express = require('express');
const StoreItems = require('../models/storeItems');
const Cart = require('../models/cart')
const User = require('../models/user');
const router = express.Router();

router.get('/user/:cartId', async (req,res)=>{
    const foundUser = await User.find(usr => usr.cart._id === req.params.cartId);
    res.send(foundUser);
})

router.get('/cart', async (req, res) => {
    const foundCart = await Cart.find({}).populate('storeitems');
    res.send(foundCart ? foundCart : 404)
})

router.get('/cart/:cartId', async (req, res) => {
    const foundCart = await Cart.findById({_id : req.params.cartId}).populate('storeitems');
    res.send(foundCart ? foundCart : 404)
})

/*router.get('/cart:CartId/cartItem', async (req,res)=>{
    const foundCart = await Cart.findById(req.params.CartId);
    const storeItem = await StoreItems.find(req.params.cartItem);

    await foundCart.add(storeItem, storeItem._id);
    res.send(foundCart);
})*/


router.post('/cart/:CartId/cartItem', async function (req, res){
    const foundCart = await Cart.findById(req.params.CartId);
    const Item = req.body;
    const foundItem = await StoreItems.find({title : Item.title})
    if(foundCart.items.length == 0){
        const newCart = {items:[{productId: foundItem._id, qty:1}], totalPrice: foundItem.price};
        //newCart._id = foundCart._id;
        foundCart.items = newCart.items;
        foundCart.totalPrice = newCart.totalPrice;
        // foundCart.items.push({productId: foundItem._id, qty: 1});
        // foundCart.totalPrice = foundItem.price;
    }
    else{
        const isExisting = foundCart.items.findIndex(objItems => objItems.productId == foundItem._id);
        if( isExisting == -1){
             foundCart.items.push({productId: foundItem._id, qty: 1});
            foundCart.totalPrice += foundItem.price;
            // foundItem.quantity -=1;

        }else{
            const ExistingProdInCart = foundCart.items[isExisting];
            ExistingProdInCart.qty += 1;
            foundCart.totalPrice += foundItem.price;

        }
    }
    // if(!foundCart.totalPrice){
    //     foundCart.totalPrice = 0;
    // }
    // foundCart.totalPrice += foundItem.price;
    //const update = foundCart.totalPrice;
    //await Cart.();
    foundCart.save();


    res.send(foundCart ? foundCart : 404);
})



module.exports = router;