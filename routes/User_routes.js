const express = require("express");
const user_controller = require("../controllers/users.controller");
const AuthenticationMiddleware = require("../middleware/authentication.middleware");

const passport = require("passport");

const router = express.Router({ mergeParams: true });

router.use(express.json());
router.use(passport.initialize());

require("../boot/fb.auth")();

router.get("/", (req, res) => {
  res.send("hello this is the users page");
});

router.post("/sign_up", user_controller.SignUp);

// route for signing up and login in via facebook
router.get("/sl_up_fb", (req, res) => {
  res.render("fb_signup.ejs");
});

// route to ensure unsecuesful login
router.get("/failed_fb_login", (req, res) => {
  res.status(400).send("Failed facebook login");
});

//This endpoint connects the User to Facebook
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    //authType: "reauthenticate",
    failureRedirect: "/failed_fb_login",
    scope: ["email"],
  }),
  require("../middleware/facebook_db_checker.middleware").VerifyUserinDB,
  async function (req, res) {
    // Successful authentication, process flow is diverted to check if user exists in db .
  }
);

router.get("/authentication/activate/:token", user_controller.CreateUser);

router.post("/login", user_controller.LoginUser);

router.get(
  "/all_users",
  AuthenticationMiddleware.VerifyToken,
  user_controller.ShowUsers
);

router.put(
  "/update_user",
  AuthenticationMiddleware.VerifyToken,
  user_controller.UpdateUser
);

router.delete(
  "/delete_user/:id",
  AuthenticationMiddleware.VerifyToken,
  user_controller.DeleteUser
);

router.get(
  "/request_password_change",
  AuthenticationMiddleware.VerifyToken,
  user_controller.RequestPasswordChange
);

router.get(
  "/request_password_change/changepass/:token",
  user_controller.PasswordChangeToken
);

router.patch(
  "/request_password/reset",
  AuthenticationMiddleware.VerifyPassToken,
  user_controller.ChangePasswordRequest
);

module.exports = router;
