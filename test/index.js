process.env.NODE_ENV = "test";

const chai = require("chai");
const chaihttp = require("chai-http");
const server = require("../app");

const user_testing = require("./users.tests.");
const report_testing = require("./reports.tests");
const task_testing = require("./tasks.tests");

//Assertion style
chai.should();
chai.use(chaihttp);

let token = "";
function alter_token(token_val) {
  token = token_val.replace(/['"]+/g, "");
}

describe("Testing API", () => {
  describe("Login API for jwt token", () => {
    /**
     * --------------------
     * User Login
     * --------------------
     */
    it("Logs in a user ", (done) => {
      user = {
        email: "ha55ana4bar@gmail.com",
        passwd: "test123",
      };
      chai
        .request(server)
        .post("/api/users/login")
        .send(user)
        .end((err, res) => {
          if (err) {
            return done(err);
          } else {
            alter_token(res.text);
            res.should.have.status(201);
            res.body.should.be.a("string");
          }
          done();
        });
    });

    //for an invalid login pass combination
    it("Does NOT Login as a user due to invalid combo ", (done) => {
      user = {
        email: "ha55ana4bar@gmail.com",
        passwd: "test1233",
      };
      chai
        .request(server)
        .post("/api/users/login")
        .send(user)
        .end((err, res) => {
          if (err) {
            return done(err);
          } else {
            res.should.have.status(500);
            res.text.should.be.eq("Invalid email/password combination");
          }
          done();
        });
    });
  });

  /**
   *
   * Loading user.tests.js class and testing user routes
   * Includes all user module oriented user routes and functionality testing
   *
   */
  describe("Loading User Test API", () => {
    it("Testing User Route functionalities", (done) => {
      user_test = new user_testing(token, server);
      user_test.test_cases();
      done();
    });
  });

  /**
   *
   * Loading tasks.tests.js class and testing user routes
   * Includes all task module oriented task routes and functionality testing
   *
   */

  describe("Loading Tasks Test API", () => {
    it("Testing Task Route functionalities", (done) => {
      task_test = new task_testing(token, server);
      task_test.test_cases();
      done();
    });
  });

  /**
   *
   * Loading report.tests.js class and testing user routes
   * Includes all report module oriented report routes and functionality testing
   *
   */
  describe("Loading Report Test API", () => {
    it("Testing Report Route functionalities", (done) => {
      report_test = new report_testing(token, server);
      report_test.test_cases();
      done();
    });
  });
});
