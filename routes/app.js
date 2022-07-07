const express = require('express');
const router = express.Router();
const auth = require("../auth");


router.get("/app", auth, (req, res) => {
    
    res.status(200).json({message:"This is home page"});
  });

module.exports = router;

