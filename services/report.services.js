const Tasks = require("../models/index_models").Tasks;
const User = require("..//models/index_models").Users;
const { Op } = require("sequelize");
const moment = require("moment");

const err_hanlder = (err) => {
  console.log(`Error : ${err}`);
};

module.exports.Get_Task_Reports = async (user_info) => {
  const report_query = await Tasks.count({
    attributes: ["task_status"],
    group: "task_status",
    include: [
      {
        model: User,
        as: "Users",
        attributes: [],
        where: { email: user_info.email },
      },
    ],
  })
    .then((query_response) => {
      return query_response;
    })
    .catch(err_hanlder);
  if (report_query) {
    return report_query;
  } else {
    return "NoResponse";
  }
};

module.exports.Get_Average_Completions = async (user_info) => {
  let average_query = await Tasks.findAll({
    attributes: [
      [Tasks.sequelize.fn("count", Tasks.sequelize.col("*")), "total"],
      [
        Tasks.sequelize.literal(
          `sum(CASE task_status WHEN "active" THEN 1 ELSE 0 END )`
        ),
        "active_tasks",
      ],
      [
        Tasks.sequelize.literal(
          `sum(CASE task_status WHEN "pending" THEN 1 ELSE 0 END )`
        ),
        "pending_tasks",
      ],
      [
        Tasks.sequelize.literal(
          `sum(CASE task_status WHEN "completed" THEN 1 ELSE 0 END )`
        ),
        "completed_tasks",
      ],
    ],
    include: [
      {
        attributes: [],
        model: User,
        as: "Users",
        where: { email: user_info.email },
      },
    ],
    raw: true,
  });

  if (await average_query) {
    const average_completed_tasks =
      (parseInt(average_query[0].completed_tasks) / average_query[0].total) *
      100;

    average_query[0]["average_completions"] = average_completed_tasks;
    return average_query;
  } else {
    return false;
  }
};

module.exports.Get_Late_Completions = async (user_info) => {
  const late_completion_query = await Tasks.count({
    where: {
      completion_date_time: { [Op.gt]: Tasks.sequelize.col("due_date_time") },
    },
    include: [
      {
        attributes: [],
        model: User,
        as: "Users",
        where: { email: user_info.email },
      },
    ],
  });

  if (late_completion_query) {
    return JSON.stringify(late_completion_query);
  } else {
    return false;
  }
};

module.exports.Get_Max_Day_completions = async (user_info) => {
  /**
   * Calculates the date for the maximum number of tasks completions
   */
  const max_completions_query = await Tasks.findAll({
    attributes: [
      [
        Tasks.sequelize.fn(
          "date_format",
          sequelize.col("completion_date_time"),
          "%Y-%m-%d"
        ),
        "date",
      ],
      [
        Tasks.sequelize.fn("count", Tasks.sequelize.col("creation_date_time")),
        "occurances",
      ],
    ],

    where: [
      Tasks.sequelize.where(
        Tasks.sequelize.fn(
          "date_format",
          sequelize.col("creation_date_time"),
          "%Y-%m-%d"
        ),
        "=",
        Tasks.sequelize.fn(
          "date_format",
          sequelize.col("completion_date_time"),
          "%Y-%m-%d"
        )
      ),
    ],

    group: [
      [
        Tasks.sequelize.fn(
          "date_format",
          sequelize.col("completion_date_time"),
          "%Y-%m-%d"
        ),
      ],
    ],

    order: [[sequelize.literal("occurances", "DESC")]],
    raw: true,
    include: [
      {
        attributes: [],
        model: User,
        as: "Users",
        where: { email: user_info.email },
      },
    ],
  })
    .then((query_response) => {
      return query_response;
    })
    .catch(err_hanlder);

  if (max_completions_query) {
    return max_completions_query.pop();
  } else {
    return false;
  }
};

module.exports.Get_Perday_Creation_Reports = async (user_info) => {
  /**
   * Finds the total ammount of tasks created on every day of the week
   */
  const daily_reports = await Tasks.findAll({
    attributes: [
      [
        sequelize.literal(
          `sum(CASE DATE_FORMAT(creation_date_time, '%a')
           WHEN "Mon" THEN 1 ELSE 0 END )`
        ),
        "Monday",
      ],
      [
        sequelize.literal(
          `sum(CASE DATE_FORMAT(creation_date_time, '%a')
           WHEN "Tues" THEN 1 ELSE 0 END )`
        ),
        "Tuesday",
      ],
      [
        sequelize.literal(
          `sum(CASE DATE_FORMAT(creation_date_time, '%a')
           WHEN "Wed" THEN 1 ELSE 0 END )`
        ),
        "Wednesday",
      ],
      [
        sequelize.literal(
          `sum(CASE DATE_FORMAT(creation_date_time, '%a')
           WHEN "Thurs" THEN 1 ELSE 0 END )`
        ),
        "Thursday",
      ],
      [
        sequelize.literal(
          `sum(CASE DATE_FORMAT(creation_date_time, '%a')
           WHEN "Fri" THEN 1 ELSE 0 END )`
        ),
        "Friday",
      ],
      [
        sequelize.literal(
          `sum(CASE DATE_FORMAT(creation_date_time, '%a')
           WHEN "Sat" THEN 1 ELSE 0 END )`
        ),
        "Saturday",
      ],
      [
        sequelize.literal(
          `sum(CASE DATE_FORMAT(creation_date_time, '%a')
           WHEN "Sun" THEN 1 ELSE 0 END )`
        ),
        "Sunday",
      ],
    ],
    raw: true,
  });

  return daily_reports;
};
