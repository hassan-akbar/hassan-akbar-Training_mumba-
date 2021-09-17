const jwt = require("jsonwebtoken");

module.exports.VerifyToken = async (req, res, next) => {
  const auth_header = await req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1];
  if (token === null) {
    return res.send("No token provided");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403).json(err);
    } else {
      req.user = user;
      next();
    }
  });
};
