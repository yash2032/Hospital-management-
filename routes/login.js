const express = require('express');
const router = express.Router();
const auth= require('../auth');
const User = require('../server/models/user');
const jwt= require('jsonwebtoken');



router.get('/', (req, res) => {
    res.send('Login Page');
});

router.route('/login').post( async (req, res) => {
    try {
        
        console.log(req.body);
        const { username, password } = req.body;
    
        
        if (!(username && password)) {
          res.status(400).send("All input are required");
        }
       
        const user = await User.findOne({ username });
        
    
        if (user ){//&& (await bcrypt.compare(password, user.password))) {

           
          
          const token = jwt.sign(
            { user_id: user._id, username },
            "key",
          );
         //console.log(token);
         res.cookie("access_token", token).send(token);
         
          res.redirect('/app');
        }

       // res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }}
);

router.get('/app/logout',auth, function(req, res) {
    res
    .clearCookie("access_token")
    .status(200)
    .redirect('/');
});

module.exports = router;