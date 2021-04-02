const jwt = require('jsonwebtoken');

function auth(req, res, next) {
   const tokenString = req.headers.authorization;

   //Check for token 
   if (!tokenString) {
      return res.status(401).json({ msg: "No token, authorization denied" });
   }

   try {
      // Verify token
      const token = tokenString.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      //Add user from payload
      req.userData = decoded;
      next();
   }
   catch (e) {
      res.status(401).json({ msg: "Authentication Failure" });
   }

}

module.exports = auth;