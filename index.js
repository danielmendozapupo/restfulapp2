const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const router = express.Router();

const app = express();
app.use(express.json());

const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const storeItemsRoutes = require('./routes/storeItems');
const jwt = require("jsonwebtoken");


const port = process.env.PORT || 8080;

const User = require('./models/user');
const StoreItems = require("./models/storeItems");
const Cart = require('./models/cart');
//app.use(router);


const url = 'mongodb+srv://dbUser:dbUserPassword@cluster0.ij9xt.mongodb.net/Project1_SoftDev?retryWrites=true&w=majority';



const dataStore = [];

//Database Name
const dbName = 'Project1_SoftDev';

let database;

//axios header config
const config = {
    headers :{
        'X-API-KEY' : 'a721d0c518cc4122995f8fa99ae8c2be'
    }
}

const initDatabase = async ()=>{
    database = await mongoose.connect(url, {useCreateIndex: true, useUnifiedTopology:true, useNewUrlParser: true });
    if(database){
        app.use(router);
        console.log('Successfully connected to my DB');
    }
    else{
        console.log('Error connecting to my DB');
    }
}

initDatabase();
app.use(session({
    secret : 'ItsAsecretWord',
    store: new MongoStore({mongooseConnection:mongoose.connection}),
    resave: false,
    saveUninitialized: false

}));



const initializeCart = async () => {
    const cart = [];
    const users = await User.find({});

    for (let i = 0; i < users.length; i++) {
        const newCart = await Cart.create({items:[],totalPrice: 0});
        users[i].cart = newCart;
        await users[i].save();
        //cart.push(newCart);
    }
    //await Cart.create(cart);
}

//
// const initializeUsers = async()=>{
//     const users = [];
//     const carts = await Cart.find({});
//
//     const firstNamePromise = await axios.get('https://randommer.io/api/Name?nameType=firstname&quantity=50',config);
//     const lastNamePromise = await axios.get('https://randommer.io/api/Name?nameType=surname&quantity=50', config);
//
//     const extensions = ['@hotmail.com', '@gmail.com', '@yahoo.com'];
//
//     const results = await Promise.all([firstNamePromise, lastNamePromise]);
//     results[0].data.forEach((name, index) => {
//         const assignedCart = carts[Math.floor(Math.random()*carts.length)];
//         const firstName = name;
//         const lastName = results[1].data[index];
//         const email = name.toLowerCase() +'.' + results[1].data[index].toLowerCase() +
//             extensions[Math.floor(Math.random() * extensions.length)];
//         users.push({firstName, lastName, email, login:`${firstName}.${lastName}`,password: 'password123', cart:assignedCart});
//     });
//
//     await User.create(users);
//
// };

// const storeData = require('./Data/sampleStore.json');
//
// const initializeStoreItems = async() =>{
//    await StoreItems.create(storeData);
// }



// const initializeAllData = async ()=>{
//     await initDatabase();
//
//
//     await User.deleteMany({}); // clean the database before populate it.
//     await StoreItems.deleteMany({});
//     await Cart.deleteMany({});
//
//     await initializeUsers();
//     await initializeStoreItems();
//     await initializeCart();
//     // const authors = await Author.find().populate('books');
//     // console.log(`Author data initialized: ${authors}`);
//
// };

// initializeAllData();

app.use(userRoutes);
app.use(cartRoutes);
app.use(storeItemsRoutes);


app.get('/', async (req,res) =>{
    console.log(`req.session: ${JSON.stringify(req.session)} `);
    req.session.numCalls++;
    res.send(200);
})



/////////////////////////////////////////////////////////////////////////
app.use((req, res) => {
    res.status(404).send('Element Not Found');
});

const accessTokenSecret = "someSecretIJustInvented!";
//Create a middleware to authenticate the app
app.use(async (req, res, next)=>{
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            //Bearer,eyeklsd...
            const jwtToken = authHeader.split(' ')[1];
            const user = jwt.verify(jwtToken, accessTokenSecret);
            req.user = user;
        }
        // }else{
        //     //Really we should redirect
        //     return res.send(401);
        // }
    }
    catch (err){
        res.send(403);
    }
    next();
})

app.listen(port, ()=>{
    console.log(`Ecommerce app listening at http://localhost:${port}`);
})
