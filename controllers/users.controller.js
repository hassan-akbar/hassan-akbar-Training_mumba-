const User_services = require("../services/user_crud.services");
const logger = require("../logger/winston_logger");

const err_handler = (err) => {
  logger.error(err.stack);
};

const info_logger = (req, Type, function_call) => {
  const message = `Route :${
    req.route.path
  } ---> Type: ${Type} ---> Sending:${JSON.stringify(
    req.body
  )} ---> ${function_call} ---> Method:${JSON.stringify(req.route.methods)}`;

  logger.info(JSON.stringify(message), { service: "user_crud.services.js" });
};

module.exports.LoginUser = async (req, res) => {
  info_logger(req, "Request", "User_services.Login_User");
  const user_info = req.body;
  const access_token = await User_services.Login_User(user_info);

  if (access_token == "OauthUser") {
    res.status(403).send("Oauth Users cant login");
  } else if (access_token) {
    console.log(access_token); // remove this later only for ease of postman
    info_logger(
      req,
      "Response",
      `User_services.Get_Task_Reports${JSON.stringify(access_token)}`
    );
    res.status(201).json(access_token);
  } else {
    res.status(500).send("Invalid email/password combination");
  }
};

module.exports.SignUp = async (req, res) => {
  const user_info = await req.body;
  info_logger(req, "Request", "User_services.SingUp");
  const signup_status = await User_services.Sign_Up_User(user_info)
    .then((signup_status) => {
      return signup_status;
    })
    .catch(err_handler);
  if (signup_status) {
    info_logger(
      req,
      "Response",
      `User_services.Sing_Up_User${JSON.stringify(signup_status)}`
    );
    res.status(200).send("Please check your email for a verification link");
  } else {
    res
      .status(400)
      .send(
        `email already exists! Please click foreget password to reset your password for email ${req.body.email}`
      );
  }
};

module.exports.CreateUser = async (req, res) => {
  info_logger(req, "Request", "User_services.Create_User");
  const user_info = await req.params.token;

  await User_services.Create_User(user_info)
    .then((result_stats) => {
      info_logger(
        req,
        "Response",
        `User_services.Sing_Up_User${JSON.stringify(result_stats)}`
      );
      if (result_stats) {
        res.status(200).send("User succesfully inserted");
      } else {
        res.status(400).send(`Token expired or something went wrong `);
      }
    })
    .catch(err_handler);
};

module.exports.ShowUsers = async (req, res) => {
  info_logger(req, "Request", "User_services.ShowUsers");
  await User_services.Show_All_Users()
    .then((results) => {
      info_logger(
        req,
        "Response",
        `User_services.Show_All_Users${JSON.stringify(results)}`
      );
      res.status(200).send(results);
    })
    .catch(err_handler);
};

module.exports.UpdateUser = async (req, res) => {
  info_logger(req, "Request", "User_services.Update_User");
  const user_info = await req.body;
  await User_services.Update_User(user_info)
    .then((updateduser) => {
      info_logger(
        req,
        "Response",
        `User_services.Update_User->${JSON.stringify(updateduser)}`
      );
      if (updateduser) {
        res.status(200).send("Updated user succesfully");
      } else {
        res.status(400).send("Unsuccesful updation");
      }
    })
    .catch(err_handler);
};

//Password change module controllers
//----------------------------------------------------------------------------------------
module.exports.RequestPasswordChange = async (req, res) => {
  info_logger(req, "Request", "User_services.Request_password_change");
  const user_info = await req.user;
  delete req.user.passwd;
  await User_services.Request_password_change(user_info).then(
    (query_response) => {
      info_logger(
        req,
        "Response",
        `User_services.Request_password_change->${JSON.stringify(
          query_response
        )}`
      );
      if (query_response === "OauthUser") {
        res.status(405).send("Oauth User can't reset password");
      } else {
        res.status(200).send("Check your email");
      }
    }
  );
};

module.exports.PasswordChangeToken = async (req, res) => {
  user_token = req.params.token;
  info_logger(req, "Request", "User_services.Verify_password_change_token");
  await User_services.Verify_password_change_token(user_token).then(
    (returned_token) => {
      info_logger(
        req,
        "Response",
        `User_services.Verify_password_change_token->${JSON.stringify(
          returned_token
        )}`
      );
      if (returned_token) {
        res.status(200).send(returned_token);
      } else {
        res.status(403).send("Something went wrong");
      }
    }
  );
};

module.exports.ChangePasswordRequest = async (req, res) => {
  info_logger(req, "Request", "User_services.Change_Password_User");
  user_token = await req.user;
  pass = await req.body.passwd;
  await User_services.Change_Password_User(user_token, pass)
    .then((pass_response) => {
      info_logger(
        req,
        "Response",
        `User_services.Change_password_User->${JSON.stringify(pass_response)}`
      );
      if (pass_response) {
        res.status(200).send("Successfully updated password");
      } else {
        res.status(400).send("something went wrong");
      }
    })
    .catch(err_handler);
};

//--------------------------------------------------------------------------------------------

module.exports.DeleteUser = async (req, res) => {
  info_logger(req, "Request", "User_services.Delete_User");
  const user_id = await req.params.id;
  await User_services.Delete_User(user_id)
    .then((deleted_user) => {
      info_logger(
        req,
        "Response",
        `User_services.Delete_User->${JSON.stringify(deleted_user)}`
      );
      if (deleted_user) {
        res.status(200).send("Deleted user succesfully");
      } else {
        res.status(400).send("Unsucessfull deletion");
      }
    })
    .catch(err_handler);
};
