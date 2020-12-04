const jwt = require('jsonwebtoken')
const accessTokenSecret = "someSecretIJustInvented!";

//Create a middleware to authenticate the app
module.exports = (async (req, res, next)=>{
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            //Bearer,eyeklsd...
            const jwtToken = authHeader.split(' ')[1];
            const user = jwt.verify(jwtToken, accessTokenSecret);
            req.userJwt = user;
        }
        else{
            //Really we should redirect
            return res.sendStatus(401);
        }
    }
    catch (err){
        res.send(403);
    }
    next();
});
