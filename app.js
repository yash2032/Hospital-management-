const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('./mongoose');
var expressValidator = require('express-validator');


const User = require('./server/models/user');
const Disease = require('./server/models/diseases');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");


var login = require('./routes/login');
var appRoute = require('./routes/app');
var userRoute = require('./routes/user');
var patientRoute = require('./routes/patient');
var roomRoute = require('./routes/rooms');
var diseaseRoute = require('./routes/diseases');
var {Patient} = require('./server/models/patient');
var cors = require('cors')

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(expressValidator()); 
app.use(express.json({extended: false}));
app.use('/',login);
app.use('/',appRoute);
app.use('/',userRoute);
app.use('/',patientRoute);
app.use('/',roomRoute);
app.use('/',diseaseRoute);

// var newDisease = {
//     name:"abc",
//     score:"20",
//     symptoms:["a","b","c"]
// };


// Disease.create(newDisease, function(err, user) {
//     if (err) {
//         console.log(err);
//         return ;
//     }
// });

//encryptedPassword =  bcrypt.hash("admin", 10);

// var newUser = new User({
//     username:"admin",
//     password:"admin"
// });

// User.create(newUser, function(err, user) {
//     if (err) {
//         console.log(err);
//         return ;
//     }
// });




app.listen(5000,() => console.log(' Server on port 5000'));