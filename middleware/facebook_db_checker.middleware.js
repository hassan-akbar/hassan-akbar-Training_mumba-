const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const err_handler = async (err) => {
  console.log(err);
};
module.exports.VerifyUserinDB = async (req, res, next) => {
  //await console.log("User_info", req.user._json);

  const user_info = req.user._json;

  user_id = user_info.id;
  user_name = user_info.name;
  user_email = user_info.email;

  user_passwd = await bcrypt.hash(user_id, 10);

  const Db_Query = await Users.findOrCreate({
    defaults: {
      username: user_name,
      email: user_email,
      passwd: user_passwd,
    },
    where: { email: user_email },
  }).catch(err_handler);

  if (Db_Query) {
    try {
      user_info["provider"] = req.user.provider;

      const access_token = jwt.sign(
        user_info,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "3h",
        }
      );

      res.status(201).send(access_token);
    } catch (err) {
      err_handler(err);
    }
  } else {
    res.status(403).json("Unsucessfull transaction: Something went wrong");
  }
  next();
};
