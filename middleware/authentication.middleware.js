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

module.exports.VerifyPassToken = async (req, res, next) => {
  /**
   * For password verification a different token is used
   * this function is only used for the password token
   */
  const auth_header = await req.headers["authorization"];
  const token = auth_header && auth_header.split(" ")[1];
  if (token === null) {
    return res.send("No token provided");
  }
  jwt.verify(token, process.env.JWT_PASS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403).json(err);
    } else {
      req.user = user;
      next();
    }
  });
};
