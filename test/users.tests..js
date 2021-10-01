process.env.NODE_ENV = "test";

const chai = require("chai");
const chaihttp = require("chai-http");

//Assertion style
chai.should();
chai.use(chaihttp);

module.exports = class User_testing {
  constructor(token = "", server = "") {
    this.token = token;
    this.server = server;
  }

  test_cases() {
    const token = this.token;
    const server = this.server;
    describe("User API", () => {
      describe("", () => {
        /**
         * ------------------------------------------------------
         * Pings the main route to check if the route is working
         * ------------------------------------------------------
         */
        it("Pings the main route ", (done) => {
          chai
            .request(server)
            .get("/api/users/")
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                res.should.have.status(200);

                res.text.should.be.eq("hello this is the users page");
              }
              done();
            });
        });

        /**
         * --------------------
         * Signs a new User up
         * --------------------
         */
        it("Signs up a new user ", (done) => {
          user = {
            username: "Hassan",
            email: "ha55ana4bar121@gmail.com",
            passwd: "test123",
          };
          chai
            .request(server)
            .post("/api/users/sign_up")
            .send(user)
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                //both status 200 and 204 are valid statues based on the late enteries in the table
                res.status.should.satisfy((num) => {
                  if (num == 200 || num == 400) {
                    return true;
                  }
                  return false;
                });
              }
              done();
            });
        });

        //checking for an email that already exsits in the database

        it("Does not Signup a new user due to email existing in DB", (done) => {
          user = {
            username: "Hassan",
            email: "ha55ana4bar@gmail.com",
            passwd: "test123",
          };
          chai
            .request(server)
            .post("/api/users/sign_up")
            .send(user)
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                res.should.have.status(400);
                res.text.should.be.eq(
                  "email already exists! Please click foreget password to reset your password for email ha55ana4bar@gmail.com"
                );
              }
              done();
            });
        });

        /**
         * ---------------------------------
         * Get all the users from the databse
         * ---------------------------------
         */

        it("Gets all users from the databse ", (done) => {
          chai
            .request(server)
            .get("/api/users/all_users")
            .set("Authorization", "Bearer " + token) //set the header first
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                res.should.have.status(200);
              }
              done();
            });
        });

        /**
         * -------------------
         * Update a User
         * -------------------
         */
        it("Updates a user ", (done) => {
          user = {
            user_name: "haha",
            email: "ha55ana4bar@gmail.com",
          };
          chai
            .request(server)
            .put("/api/users/update_user")
            .set("Authorization", "Bearer " + token) //set the header first
            .send(user)
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                res.should.have.status(200);
              }
              done();
            });
        });
        /**
         * ---------------------------------------
         * Testing deleting a user route
         * ---------------------------------------
         */

        // it("Delete a User from the databse", (done) => {
        //   chai
        //     .request(server)
        //     .delete("/api/users/delete_user/2")
        //     .set("Authorization", "Bearer " + token) //set the header first
        //     .end((err, res) => {
        //       if (err) {
        //         return done(err);
        //       } else {
        //         res.should.have.status(200);
        //         res.text.should.be.eq("Deleted user succesfully");
        //         res.text.should.be.a("string");
        //       }
        //       done();
        //     });
        // });

        // for an invalid user id

        it("Does NOT Delete a User due to invalid ID", (done) => {
          chai
            .request(server)
            .delete("/api/users/delete_user/222222")
            .set("Authorization", "Bearer " + token) //set the header first
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                res.should.have.status(400);
                res.text.should.be.eq(
                  "Unsucessfull deletion : Invalid User ID"
                );
                res.text.should.be.a("string");
              }
              done();
            });
        });
        /**
         * Testing the get all route
         */
      });
    });
  }
};

//token defined for jwt authentication
