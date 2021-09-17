//service read into these
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

module.exports.FaceBookSignUp = async (req, res) => {};

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
