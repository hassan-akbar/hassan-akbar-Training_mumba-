const User = require("../models/Users");
const Tasks = require("../models/Alloted_tasks");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailgun = require("mailgun-js");

//creating a mailgun variable to handle api requests
const mg = mailgun({
  apiKey: process.env.MAILGUN_APIKEY,
  domain: process.env.MAILGUN_DOMAIN,
});

//--------------------------------------------------

const err_handler = (err) => {
  // suplimentary function to log errors
  console.log(`>Error< : ${err}`);
};

async function check_user_exists(user_email) {
  // helper function checks the db if a user exists and returns
  // true or false based on the unique email within the db
  const email_db_checker = await User.count({
    where: { email: user_email },
  })
    .then((count) => {
      if (count == 0) {
        return true;
      } else {
        return false;
      }
    })
    .catch(err_handler);

  return email_db_checker;
}

module.exports.Login_User = async (user_info) => {
  /**
   * Login module ,
   * Only allows non Oauth users to login
   *
   */
  let user = await User.findOne({ where: { email: user_info.email } });

  if (user) {
    if (!user.OauthUser) {
      // signing token  for jwt access of routes
      // compare is more secure
      if (await bcrypt.compare(user_info.passwd, user.passwd)) {
        const access_token = jwt.sign(
          user_info,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "3h",
          }
        );
        return access_token;
      }
    } else {
      return "OauthUser";
    }
  } else {
    return false;
  }
};

module.exports.Sign_Up_User = async (user_info) => {
  // uses jwt token parser to create a token request and send it to the users email
  user_check = await check_user_exists(user_info.email);
  if (user_check) {
    user_info.passwd = await bcrypt.hash(user_info.passwd, 10);
    //pasword is hashed using bcrypt and default salt 10
    //encrypting passowrd ^^
    console.log(user_info);
    const jwttoken = jwt.sign(user_info, process.env.JWT_ACC_ACTIVATE, {
      expiresIn: "15m",
    });
    const data = {
      from: "noreply@mailgun_test.com",
      to: user_info.email,
      subject: "Account Activation Link",
      html: ` <h2> Click on the given link to activate your account </h2>
              <a href="${process.env.CLIENT_URL}/api/users/authentication/activate/${jwttoken}"> Activate account </a>`,
    };
    await mg.messages().send(data, function (error, body) {
      console.log(body);
    });
    return true;
  } else {
    return false;
  }
};

module.exports.Create_User = async (body_content) => {
  //creates a user based on the verified link provided from the email
  token = body_content;

  if (token) {
    decoded_token = jwt.verify(
      token,
      process.env.JWT_ACC_ACTIVATE,
      (err, decoded_token) => {
        if (err) {
          return false;
        } else return decoded_token;
      }
    );
    console.log(decoded_token);

    if (await check_user_exists(decoded_token.email)) {
      creation_response = await User.create(decoded_token)
        .catch(err_handler)
        .then((query_response) => {
          return query_response;
        })
        .catch(err_handler);

      return creation_response;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

module.exports.Show_All_Users = async () => {
  // shows all users in the database

  const users = await User.findAll()
    .then((data) => {
      //console.log(JSON.stringify(data));
      return data;
    })
    .catch(err_handler);

  return users;
};

module.exports.Update_User = async (body_content) => {
  //updates user info based on the json request

  const updated_user = await User.update(body_content, {
    where: { email: body_content.email },
  })
    .then((resullts) => {
      return resullts;
    })
    .catch(err_handler);
  console.log(updated_user);
  return updated_user;
};

// Password reset module

//-----------------------------------------------------------------------------------------------------
module.exports.Request_password_change = async (user_info) => {
  if (user_info.provider === "facebook") {
    return "OauthUser";
  } else {
    const jwttoken = jwt.sign(user_info, process.env.JWT_ACC_ACTIVATE);
    const data = {
      from: "noreply@mailgun_test.com",
      to: user_info.email,
      subject: "Password_reset_request",
      html: ` <h2> Click on the given link to reset your password </h2>
              <a href="${process.env.CLIENT_URL}/api/users/request_password_change/changepass/${jwttoken}"> Reset password </a>`,
    };
    await mg.messages().send(data, function (error, body) {
      console.log(body);
    });
    return true;
  }
};

module.exports.Verify_password_change_token = async (user_token) => {
  const jwt_decoded = jwt.verify(
    user_token,
    process.env.JWT_ACC_ACTIVATE,
    (err, decoded_token) => {
      if (err) {
        err_handler(err);
      } else {
        return decoded_token;
      }
    }
  );
  return jwt.sign(jwt_decoded, process.env.JWT_PASS_TOKEN_SECRET);
};

module.exports.Change_Password_User = async (user_info, new_pass) => {
  let pass_obj = {};
  hashed_pass = await bcrypt.hash(new_pass, 10);
  pass_obj["passwd"] = hashed_pass;
  updated_user = await User.update(pass_obj, {
    where: {
      email: user_info.email,
    },
  })
    .then((query_response) => {
      return query_response;
    })
    .catch(err_handler);

  if (updated_user) {
    return true;
  } else return false;
};

//------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports.Delete_User = async (user_id) => {
  //deletes user from db
  const deleted_user = await User.destroy({ where: { id: user_id } })
    .then((deleted) => {
      return deleted;
    })
    .catch(err_handler);

  return deleted_user;
};
