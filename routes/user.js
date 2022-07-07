const express = require('express');
const router = express.Router();
const User = require('../server/models/user');
const auth = require("../auth");
var expressValidator = require('express-validator');



router.post('/app/adduser', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;

    // validation
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

    // if there are errors, flash messages on the screen
    var errors = req.validationErrors();
    if(errors) {
        res.status(400).json({message:'Validation error'});
    } else {
        // if everything is OK, create a new user in the database
        var newUser = new User({
            username,
            password
        });

        User.create(newUser, function(err, user) {
            if (err) {
				res.json({message:"Some error"});
                return ;
            }
        });

        
        res.status(200).json({message : "User created successfully"});
    }
});


module.exports=router;