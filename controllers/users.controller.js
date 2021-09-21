//service read into these
const { response } = require("express");
const User_services = require("../services/user_crud.services");

const err_handler = (err) => {
  console.log(`Error ${err}`);
};

module.exports.LoginUser = async (req, res) => {
  const user_info = req.body;
  const access_token = await User_services.Login_User(user_info);
  console.log(access_token);

  if (access_token) {
    res.status(201).json(access_token);
  } else {
    res.status(500).send("Invalid email/password combination");
  }
};

module.exports.SignUp = async (req, res) => {
  const user_info = await req.body;
  const signup_status = await User_services.Sign_Up_User(user_info);
  if (signup_status) {
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
  const user_info = await req.params.token;

  await User_services.Create_User(user_info)
    .then((result_stats) => {
      if (result_stats) {
        res.status(200).send("User succesfully inserted");
      } else {
        res.status(400).send(`Token expired or something went wrong `);
      }
    })
    .catch(err_handler);
};

module.exports.ShowUsers = async (req, res) => {
  await User_services.Show_All_Users()
    .then((results) => {
      res.status(200).send(results);
    })
    .catch(err_handler);
};

module.exports.UpdateUser = async (req, res) => {
  const user_info = await req.body;
  await User_services.Update_User(user_info)
    .then((updateduser) => {
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
  const user_info = await req.user;
  delete req.user.passwd;
  await User_services.Request_password_change(user_info).then(
    (query_response) => {
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
  await User_services.Verify_password_change_token(user_token).then(
    (returned_token) => {
      if (returned_token) {
        res.status(200).send(returned_token);
      } else {
        res.status(403).send("Something went wrong");
      }
    }
  );
};

module.exports.ChangePasswordRequest = async (req, res) => {
  user_token = await req.user;
  pass = await req.body.passwd;
  await User_services.Change_Password_User(user_token, pass)
    .then((pass_response) => {
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
  const user_id = await req.params.id;
  await User_services.Delete_User(user_id)
    .then((deleted_user) => {
      if (deleted_user) {
        res.status(200).send("Deleted user succesfully");
      } else {
        res.status(400).send("Unsucessfull deletion");
      }
    })
    .catch(err_handler);
};
