const schedule = require("node-schedule");
const { Op } = require("sequelize");
const mailgun = require("mailgun-js");
const Tasks = require("../models/index_models").Tasks;
const Users = require("../models/index_models").Users;

const json2html = require("node-json2html");

//creating a mailgun variable to handle api requests
const mg = mailgun({
  apiKey: process.env.MAILGUN_APIKEY,
  domain: process.env.MAILGUN_DOMAIN,
});

module.exports.DailyPendingTasks = async (req, res, next) => {
  // called on server listen
  // schedules daily emails based on pending tasks for the day
  schedule.scheduleJob("0 */5 * * 1-5", await SendDailyEmail);
};

SendDailyEmail = async () => {
  /**
   * Gets all the pending tasks from the tasks table which are due for today
   * Orders them by user id
   * sends an email to every user based on their pending tasks from the query response
   */
  console.log("Email list triggered");

  //date cant be compared using like must use greater than or less than hence two date variables are made
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  const todays_tasks = await Tasks.findAll({
    attributes: [
      "title",
      "description",
      "due_date_time",
      "task_status",
      "user_id",
    ],
    where: {
      due_date_time: { [Op.gt]: TODAY_START, [Op.lt]: NOW },
      task_status: { [Op.not]: "completed" },
    },
    raw: true,

    include: [
      {
        model: Users,
        as: "Users",
        attributes: ["email"],
        group: "id",
      },
    ],
  });
  // checking if there are any tasks pending for today
  if (todays_tasks.length != 0) {
    // setting the first users email as default
    let curr_email = todays_tasks[0]["Users.email"];
    let buffer_task_list = JSON.parse(JSON.stringify(todays_tasks));
    let task_que = [];
    //template used for json2html library requires the template in which the email will be sent
    const template = {
      "<>": "div",
      html: [
        { "<>": "h4", html: "Title: ${title}" },
        { "<>": "h4", html: "Description : ${description}" },
        { "<>": "h4", html: "Due Date : ${due_date_time}" },
        { "<>": "h4", html: "Status : ${task_status}" },
      ],
    };
    /**
     * -Itrates over all the tasks
     * -If the email from the tasks matches the current email
     *  Adds the task to the task_que variable
     * -If the email doesnt match , then sends the task queu as an email to the current email , resets the task que and the sets
     *  the current email to the new email found
     * -If the new email found corresponds to the last task in the list , sends the task info to the newly found email
     *
     */
    for (var task_number in buffer_task_list) {
      if (buffer_task_list[task_number]["Users.email"] === curr_email) {
        delete buffer_task_list[task_number]["Users.email"];
        task_que.push(buffer_task_list[task_number]);
      } else {
        const data = {
          from: "noreply@mailgun_test.com",
          to: curr_email,
          subject: "Todays_tasks",
          html: ` <h2> Pending Tasks for today </h2>
                   <div>${json2html.render(task_que, template)}</div>`,
        };
        await mg.messages().send(data, function (error, body) {
          console.log(body);
        });

        task_que = [];
        curr_email = buffer_task_list[task_number]["Users.email"];
        console.log("task number ", task_number);

        if (task_number == todays_tasks.length - 1) {
          delete buffer_task_list[task_number]["Users.email"];
          task_que.push(buffer_task_list[task_number]);
          const data = {
            from: "noreply@mailgun_test.com",
            to: curr_email,
            subject: "Todays_tasks",
            html: ` <h2> Pending Tasks for today </h2>
            <div>${json2html.render(task_que, template)}</div>`,
          };
          await mg.messages().send(data, function (error, body) {
            console.log(body);
          });
        }
      }
    }
  } else {
    console.log("No pedning tasks for today");
  }
};
