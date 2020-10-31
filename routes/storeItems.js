const express = require('express');
const StoreItems = require('../models/storeItems')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const router = express.Router();


router.get('/StoreItem', async (req,res)=>{

    const foundProducts = await StoreItems.find({});
    res.send(foundProducts ? foundProducts : 404);
})

router.get('/StoreItem/:StoreItemID', async (req,res)=>{
    const foundStoreItem = await StoreItems.findById(req.params.StoreItemID);
    res.send(foundStoreItem ? foundStoreItem : 404)
})

router.get('/StoreItem/Recent', async (req,res)=>{
    const StoreItemsVisited = StoreItems.find({}).session.lastStoreItemViewed.limit(req.query.num);

    res.send(StoreItemsVisited ? StoreItemsVisited : 404)


})



router.post('/StoreItem', async (req, res)=>{
    const newProd = await StoreItems.create(req.body);
    res.send(newProd ? newProd : 500);
});

router.put('/StoreItem/:StoreItemID', async (req, res)=>{
    if(!req.body.title || !req.body.type){
        res.send(422);
    }
    const updatedProd = await StoreItems.findByIdAndUpdate(req.params.StoreItemID, req.body,{returnOriginal:false});
    res.send(updatedProd ? updatedProd : 404);
})

router.delete('/StoreItem/:StoreItemID', async (req, res)=>{
    const deleteProduct = await StoreItems.findByIdAndDelete(req.params.StoreItemID);
    res.send(deleteProduct ? deleteProduct : 404);
})

module.exports = router;