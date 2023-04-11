const jwt = require("jsonwebtoken");
//middleware to validate jwt token
const validateToken = async (req, res, next) => {
  try {
    let header = req.headers["authorization"];
    if (header && header.startsWith("Bearer")) {
      token = header.split(" ")[1].toString();
      if (token) {
        //verifying token with the secret key
        jwt.verify(token, process.env.SECRET, (err, valid) => {
          if (err) res.status(404).json("Authorisation failed");
          else {
            console.log(valid.EmailExists);
            req.id = valid.EmailExists._id;
            next();

            console.log("success");
          }
        });
      }
    }
  } catch (err) {
    // internal error response
    res.status(500).json({ error: err.message });
  }
};
module.exports = validateToken;
