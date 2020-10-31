const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        firstName : String,
        lastName : String,
        email: String,
        cart:[{type: mongoose.ObjectId, ref: 'Cart'}]

    }
 )

const User = mongoose.model('User', UserSchema);

module.exports = User;
