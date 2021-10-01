process.env.NODE_ENV = "test";

const chai = require("chai");
const chaihttp = require("chai-http");
const server = require("../app");

//Assertion style
chai.should();
chai.use(chaihttp);

module.exports = class task_testing {
  constructor(token = "", server = "") {
    this.token = token;
    this.server = server;
  }

  test_cases() {
    const token = this.token;
    const server = this.server;

    /**
     * Task integration testing
     */

    describe("Tasks-API", () => {
      describe("", () => {
        let deletedid = 0;
        /**
         * -----------------------------------------------------
         * Pings the main route to check if the route is working
         * -----------------------------------------------------
         */
        it("Pings the main route ", (done) => {
          chai
            .request(server)
            .get("/api/tasks/hello")
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                res.should.have.status(200);

                res.text.should.be.eq("hello this is the route page");
              }
              done();
            });
        });

        /**
         * --------------------------------------------
         * Testing the POST route to get add a new Task
         * --------------------------------------------
         */

        it("Create a New Task in the DB", (done) => {
          const task = {
            title: "Task title1",
            description: "Test task",
            due_date_time: "2019-02-18 11:15:45",
            completed_task: 0,
            user_id: 1,
          };

          chai
            .request(server)
            .post("/api/tasks/create_task")
            .set("Authorization", "Bearer " + token) //set the header first
            .send(task)
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
         * -----------------------------------------
         * Testing the GET route to get all Tasks
         * -----------------------------------------
         */

        it("Returns All Tasks in db", (done) => {
          chai
            .request(server)
            .get("/api/tasks/get_tasks")
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                deletedid = res.body.pop().id;
                res.should.have.status(200);
                res.body.should.be.a("array");
              }
              done();
            });
        });

        it("Does NOT Returns All Tasks in db", (done) => {
          chai
            .request(server)
            .get("/api/tasks/get_taskss")
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                res.should.have.status(404);
              }
              done();
            });
        });

        /**
         * Testing the attachment upload part
         *
         * ask if this is testable
         */

        /**
         * --------------------------------
         * Testing the Task update Path
         * --------------------------------
         */

        it("Update a task in the  DB", (done) => {
          const task = {
            title: "Task Updated now",
            description: "I updated this",
            due_date_time: "2019-02-18 11:15:45",
            completed_task: "1",
            id: deletedid,
          };

          chai
            .request(server)
            .patch("/api/tasks/update_task_status")
            .set("Authorization", "Bearer " + token) //set the header first
            .send(task)
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                res.should.have.status(200);
              }
              done();
            });
        });

        it("Does Not Update a task in the DB due to an invalid id", (done) => {
          const task = {
            title: "Task Updated now",
            description: "I updated this",
            due_date_time: "2019-02-18 11:15:45",
            completed_task: "1",
            id: "2221",
          };

          chai
            .request(server)
            .patch("/api/tasks/update_task_status")
            .set("Authorization", "Bearer " + token) //set the header first
            .send(task)
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                res.should.have.status(401);
              }
              done();
            });
        });

        /**
         * ---------------------------------
         * Testing the delete Task route
         * ---------------------------------
         */

        it("Delete a task in the DB", (done) => {
          chai
            .request(server)
            .delete("/api/tasks/delete_task/" + deletedid)
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

        // for an invalid query
        it("Does NOT Delete a task in the DB due to an invalid request", (done) => {
          chai
            .request(server)
            .delete("/api/tasks/delete_task/454")
            .set("Authorization", "Bearer " + token) //set the header first
            .end((err, res) => {
              if (err) {
                return done(err);
              } else {
                res.should.have.status(400);
              }
              done();
            });
        });
      });
    });
  }
};
