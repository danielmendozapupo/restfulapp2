const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreItemsSchema = new Schema(
    {
        title : String,
        type : String,
        description : String,
        price: Number,
        quantity: Number
    }
);

module.exports = mongoose.model('StoreItems', StoreItemsSchema);
