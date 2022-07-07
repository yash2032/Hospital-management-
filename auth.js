const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");


const verifyToken = (req, res, next) => {
  // console.log(req);

  const token =req.cookies.access_token;
 
     //|| req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Login required");
  }
  try {
    const decoded = jwt.verify(token, "key");
    req.user = decoded;
    
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;