const express = require('express');
const User = require('../models/user')
const Cart = require("../models/cart");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const StoreItems = require('../models/storeItems')

const router = express.Router();



//Gets the user info given the id
router.get('/user/:UserId', async (req, res) => {
    const userFound = await User.findById({_id : req.params.UserId}).populate('cart');
    res.send(userFound || 404);

})

//Get all users that satisfy the regular expression query
router.get('/user', async (req, res) => {
    const foundUsers = await User.find({
        firstName: new RegExp(req.query.firstName),
        lastName: new RegExp(req.query.lastName),
        email: new RegExp(req.query.email)
    }).populate('carts');
    res.send(foundUsers ? foundUsers : 404);
})


// Creates a new user
router.post('/user', async (req, res) => {
    // const newUser = new User({
        //     firstName : req.body.firstName,
        //     lastName : req.body.lastName,
        //     email : req.body.email,
        // })
        // const user = await User.find({firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email});
        // if(user){
        //     res.status(404).send('User Already Exist in the Database');
        //     return;
        // }else{
        //     User.push(newUser);
        //     res.send(newUser);
        // }
    const newUser = await User.create(req.body);
    const newCart = await Cart.create({totalPrice : 0});
    newUser.cart = newCart;
    await newUser.save();
    res.send(newUser ? newUser : 500);
});

///////////////////////////////////////////////////////////////////////////
// router.get('/cart', async (req, res) => {
//     const foundCart = await Cart.find({}).populate('storeitems');
//     res.send(foundCart ? foundCart : 404)
// })
//
//
// router.get('/StoreItem', async (req,res)=>{
//
//     const foundProducts = await StoreItems.find({});
//     res.send(foundProducts ? foundProducts : 404);
// })

//////////////////////////////////////////////////////////////////////////////////////////////////////
router.put('/user/:id', async (req,res)=>{
    if(!req.body.firstName || !req.body.lastName){
        res.send(422);
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body,{returnOriginal: false});
    res.send( updatedUser ? updatedUser : 404);
})


router.delete('/user/:UserId', async(req,res)=>{
    // User.findByIdAndRemove(req.params.UserId, function (err, post){
    //     if(err) return err;
    //     res.send(post);
    // });
    const deletedUser = await User.findByIdAndDelete(req.params.id).populate('carts');
    if(deletedUser){
        deletedUser.cart.items.forEach(items=> items.remove());
    }
    res.send(deletedUser ? deletedUser : 404);
})


router.delete('/user/:UserId/cart',async (req, res) => {
    const user = await User.findById(req.params.UserId);
    if(!user) return ('The user with the given ID was not found.',404);
    user.cart = [];
    user.save();
    res.send(user.cart);
})


router.get('/user/:UserId/cart', async (req, res) => {
    const user = await User.findById(req.params.UserId);
    if(!user) return ('The user with the given ID was not found.',404);
    res.send(user.cart);
})



module.exports = router;