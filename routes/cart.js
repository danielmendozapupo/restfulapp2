
const express = require('express');
const StoreItems = require('../models/storeItems');
const Cart = require('../models/cart')
const User = require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');


const accessTokenSecret = "someSecretIJustInvented!";
//  Create the Express middleware that handles the authentication process:
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};



router.get('/cart', authenticateJWT, async (req, res) => {
    await req.user;
    const foundCart = await Cart.find({}).populate('storeitems');
    const foundUser = await User.find({cart : foundCart})
    if(!req.session.lastCartUserViewed){
        req.session.lastCartUserViewed = [foundUser];
    }
    else{
        req.session.lastCartUserViewed.push(foundUser);
    }
    res.send(foundCart ? foundCart : 404)
})

router.get('/cart/:cartId', authenticateJWT, async (req, res) => {
    await req.user;
    const foundCart = await Cart.findById({_id : req.params.cartId}).populate('storeitems');
    res.send(foundCart ? foundCart : 404)
})


router.post('/cart/:CartId/cartItem', authenticateJWT, async function (req, res){
    await req.user;
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
            objInItems => String(objInItems.productId).trim() === String(foundItem._id).trim());
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

router.delete('/cart/:cartId/storeItem', authenticateJWT,async (req, res)=>{
    await req.user;
    const foundCart = Cart.findById(req.params.cartId);
    const foundItem = StoreItems.findById(req.body._id);
    const isExisting = foundCart.items.findIndex(
        objInItems => String(objInItems.productId).trim() === String(foundItem._id).trim());
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