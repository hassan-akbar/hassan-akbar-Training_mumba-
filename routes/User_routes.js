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
  res.send("Failed facebook login");
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
    res.redirect("/api/users/auth/facebook/parse");
  }
);

/*
route to confirm user has successfully loged in
Never used since endpoint route returns jwt token in a res send 
*/
router.get("/auth/facebook/parse", async (req, res) => {
  res.json("Facebook User Loged in Succesfully");
});

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
module.exports = router;
