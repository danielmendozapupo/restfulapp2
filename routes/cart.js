
const express = require('express');
const StoreItems = require('../models/storeItems');
const Cart = require('../models/cart')
const User = require('../models/user');
const router = express.Router();


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
    const foundItem = await StoreItems.findById( req.body.id);
    if(foundCart.items.length == 0){
        const newCart = {items:[{productId: foundItem._id, qty:1}], totalPrice: foundItem.price};
        foundCart.items = newCart.items;
        foundCart.totalPrice = newCart.totalPrice;
        foundItem.quantity -= 1;
    }
    else{
        const isExisting = foundCart.items.findIndex(
            objInItems => new String(objInItems.productId).trim() === new String(foundItem._id).trim());
        if( isExisting == -1){
            foundCart.items.push({productId: foundItem._id, qty: 1});
            foundCart.totalPrice += foundItem.price;
            foundItem.quantity -=1;
        }else{
            const ExistingProdInCart = foundCart.items[isExisting];
            ExistingProdInCart.qty += 1;
            foundCart.totalPrice += foundItem.price;
            foundItem.quantity -=1;
        }
    }
    foundCart.totalPrice = foundCart.totalPrice.toFixed(3)
    foundCart.save();
    foundItem.save();
    res.send(foundCart ? foundCart : 404);
})

router.delete('/cart/:cartId/storeItem', async (req, res)=>{
    const foundCart = Cart.findById(req.params.cartId);
    const foundItem = StoreItems.findById(req.body._id);
    const isExisting = foundCart.items.findIndex(
        objInItems => new String(objInItems.productId).trim() === new String(foundItem._id).trim());
    if(isExisting){
        foundCart.items[isExisting].qty -= 1;
        foundItem.quantity+= 1;
        foundCart.save();
        foundItem.save();
    }else{
        res.send(404)
    }

    res.send(foundCart ? foundCart : 404);


})

module.exports = router;