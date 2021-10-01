process.env.NODE_ENV = "test";

const chai = require("chai");
const chaihttp = require("chai-http");
const server = require("../app");

//Assertion style
chai.should();
chai.use(chaihttp);

module.exports = class report_testing {
  constructor(token = "", server = "") {
    this.token = token;
    this.server = server;
  }

  test_cases() {
    const token = this.token;
    const server = this.server;
    describe("Reports-API", () => {
      describe("", () => {
        /**
         * ------------------------------------------------------
         * Pings the main route to check if the route is working
         * ------------------------------------------------------
         */
        it("Pings the main route ", (done) => {
          chai
            .request(server)
            .get("/api/reports/")
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                res.should.have.status(200);

                res.text.should.be.eq("hello this page is alive");
              }
              done();
            });
        });

        /**
         * ------------------------------------------------------
         * Testing all pending tasks status route
         * ------------------------------------------------------
         */
        it("Gets all pending tasks  ", (done) => {
          chai
            .request(server)
            .get("/api/reports/total_tasks")
            .set("Authorization", "Bearer " + token) //set the header first
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                res.should.have.status(201);
                res.body.should.be.a("array");
                //the function returns an array of dictionary hence why property 0 is accessed first before checking for the task_status
                res.body.should.have.property("0").property("task_status");
              }
              done();
            });
        });

        /**
         * ------------------------------------------------------
         * Testing the average tasks route
         * ------------------------------------------------------
         */
        it("Gets all average tasks", (done) => {
          chai
            .request(server)
            .get("/api/reports/average_completed_tasks")
            .set("Authorization", "Bearer " + token) //set the header first
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                res.should.have.status(200);
                res.body.should.be.a("array");
                //the function returns an array of dictionary hence why property 0 is accessed first before checking for the task_status
                res.body.should.have.property("0").property("total");
                res.body.should.have.property("0").property("active_tasks");
                res.body.should.have.property("0").property("pending_tasks");
                res.body.should.have.property("0").property("completed_tasks");
                res.body.should.have
                  .property("0")
                  .property("average_completions");
              }
              done();
            });
        });

        /**
         * ------------------------------------------------------
         * Testing the late completions route
         * ------------------------------------------------------
         */
        it("Gets late completions", (done) => {
          chai
            .request(server)
            .get("/api/reports/late_completions")
            .set("Authorization", "Bearer " + token) //set the header first
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                //both status 200 and 204 are valid statues based on the late enteries in the table
                res.status.should.satisfy((num) => {
                  if (num == 200 || num == 204) {
                    return true;
                  }
                  return false;
                });
              }
              done();
            });
        });

        /**
         * ------------------------------------------------------
         * Testing the Max day completions route
         * ------------------------------------------------------
         */
        it("Gets Max Day completions", (done) => {
          chai
            .request(server)
            .get("/api/reports/max_completions_day")
            .set("Authorization", "Bearer " + token) //set the header first
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
        /**
         * --------------------
         * Signs a new User up
         * --------------------
         */
      });
    });
  }
};
//token defined for jwt authentication
