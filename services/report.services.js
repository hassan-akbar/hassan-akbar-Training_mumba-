const Tasks = require("../models/index_models").Tasks;
const User = require("..//models/index_models").Users;
const { Op } = require("sequelize");

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
          sequelize.col("creation_date_time"),
          "%Y-%m-%d"
        ),
      ],
    ],

    order: [[sequelize.literal("occurances", "DESC")]],
    raw: true,
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
