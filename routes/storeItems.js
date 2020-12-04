const express = require('express');
const StoreItems = require('../models/storeItems')
const session = require('express-session');
const jwt = require("jsonwebtoken");
const MongoStore = require('connect-mongo')(session);
const router = express.Router();

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

router.get('/StoreItem', /*authenticateJWT,*/ async (req,res)=>{
    await req.user;
    const foundProducts = await StoreItems.find({});
    res.send(foundProducts ? foundProducts : 404);
})

router.get('/StoreItem/:StoreItemID', /*authenticateJWT,*/async (req,res)=>{
    const foundStoreItem = await StoreItems.findById(req.params.StoreItemID);
    res.send(foundStoreItem ? foundStoreItem : 404)
})

router.get('/StoreItem/Recent', /*authenticateJWT,*/ async (req,res)=>{
    const StoreItemsVisited = StoreItems.find({}).session.lastStoreItemViewed.limit(req.query.num);

    res.send(StoreItemsVisited ? StoreItemsVisited : 404)


})


router.post('/StoreItem', /*authenticateJWT, */async (req, res)=>{
    await req.user;
    const newProd = await StoreItems.create(req.body);
    res.send(newProd ? newProd : 500);
});

router.put('/StoreItem/:StoreItemID', /*authenticateJWT,*/ async (req, res)=>{
    if(!req.body.title || !req.body.type){
        res.send(422);
    }
    const updatedProd = await StoreItems.findByIdAndUpdate(req.params.StoreItemID, req.body,{returnOriginal:false});
    res.send(updatedProd ? updatedProd : 404);
})

router.delete('/StoreItem/:StoreItemID'/*, authenticateJWT*/, async (req, res)=>{
    const deleteProduct = await StoreItems.findByIdAndDelete(req.params.StoreItemID);
    res.send(deleteProduct ? deleteProduct : 404);
})

module.exports = router;