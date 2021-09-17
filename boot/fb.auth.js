const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/Users");
const passport = require("passport");

module.exports = function () {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/users/auth/facebook",
        profileFields: ["id", "displayName", "email"],
        enableProof: true,
      },
      async function (accessToken, refreshToken, profile, cb) {
        [user_id, user_name, user_email] = [
          profile._json.id,
          profile._json.name,
          profile._json.email,
        ];

        if (user_email === null) {
          user_email = user_id + "@facebook.com";
        }

        //console.log(profile._json);
        return cb(null, profile);
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
