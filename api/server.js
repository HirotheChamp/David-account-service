// Author: Alec Moldovan

const path = require('path');
const express = require('express');
const cosmo_db_mongo = require("./config/db.config");
const routes = require("./routes/route");
require('dotenv').config()

console.log('ENV:::', process.env.ENVIRONMENT);
console.log('PORT:::', process.env.PORT);
console.log('MONGO_CONNECTION_STRING:::', process.env.MONGO_CONNECTION_STRING)


// Custom Libraries
const accountController = require('./controller/account.controller');


const app = express();
const port = process.env.PORT || 3080;

// Connect to Azure Cosmo DB for Mongodb
cosmo_db_mongo.connect();

app.use(express.static(path.join(__dirname, '../ui/build')));
app.use(express.json());

app.use(async (req, res, next) => {

    // Retrieves the x-access-token header
    if (req.headers["x-access-token"]) {

        const accessToken = req.headers["x-access-token"];

        // Uses the secret key used in the signing th token to verify
        // that the token has not been compromised
        const { userId, exp } = await jwt.verify(accessToken, 
            process.env.JWT_SECRET);
  
        // Check if token has expired
        if (exp < Date.now().valueOf() / 1000) { 
            return res.status(401).json({ 
                error: 
                "JWT token has expired, please login to obtain a new one" 
            }); 
        }

        // User's ID is used to retrieve all info on user
        // The info can then be used by the next middleware.
        res.locals.loggedInUser = await User.findById(userId); 
        next(); 

    } else { 
        next(); 
    } 
});
 
app.use('/', routes);


// PORT

app.listen(port, () => {
    console.log(`Server listening on the port  ${port}`);
});
