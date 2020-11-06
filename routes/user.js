const express = require('express');
const User = require('../models/user')
const Cart = require("../models/cart");
const jwt = require("jsonwebtoken");


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
    console.log(req.session)
    if(!req.session.lastUserViewed){
        req.session.lastUserViewed = [foundUsers];
    }
    else{
        req.session.lastUserViewed.push(foundUsers);
    }
    console.log(foundUsers);

    res.send(foundUsers ? foundUsers : 404);
})


// Creates a new user
router.post('/user', async (req, res) => {
    const newUser = await User.create(req.body);
    const newCart = await Cart.create({totalPrice : 0});
    newUser.cart = newCart;
    await newUser.save();
    res.send(newUser ? newUser : 500);
});

///Create a login
const accessTokenSecret = "someSecretIJustInvented!";

router.post('/user/login', async (req,res)=>{
    // const login = req.body.login;
    // const password = req.body.password;
    const {login, password}= req.body;
    const foundUser = await User.findOne({login, password});

    if(foundUser){
        //User was found create a token
        const accessToken = jwt.sign({user:foundUser}, accessTokenSecret);
        res.send(accessToken);
    }
    else{
        res.send(404);
    }
})
const refreshTokenSecret = 'yourrefreshtokensecrethere';
let refreshTokens = [];

//Token handler
//
// router.post('/token', (req, res) => {
//     const { token } = req.body;
//
//     if (!token) {
//         return res.sendStatus(401);
//     }
//
//     if (!refreshTokens.includes(token)) {
//         return res.sendStatus(403);
//     }
//
//     jwt.verify(token, refreshTokenSecret, (err, user) => {
//         if (err) {
//             return res.sendStatus(403);
//         }
//
//         const accessToken = jwt.sign({ login: user.username/*, role: user.role*/ }, accessTokenSecret, { expiresIn: '20m' });
//
//         res.json({
//             accessToken
//         });
//     });
// });
//
// router.post('/logout', (req, res) => {
//     const { token } = req.body;
//     refreshTokens = refreshTokens.filter(token => t !== token);
//
//     res.send("Logout successful");
// });
//



router.put('/user/:id', async (req,res)=>{
    if(!req.body.firstName || !req.body.lastName){
        res.send(422);
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body,{returnOriginal: false});
    res.send( updatedUser ? updatedUser : 404);
})


router.delete('/user/:UserId', async(req,res)=>{
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