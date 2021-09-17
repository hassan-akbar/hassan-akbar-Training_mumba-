const Tasks = require("../models/index_models").Tasks;
const User = require("..//models/index_models").Users;

const err_hanlder = (err) => {
  console.log(`Error : ${err}`);
};

module.exports.Get_Task_reports = async (user_info) => {
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

module.exports.Get_Average_completions = async (user_info) => {
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
      },
    ],
    raw: true,
  });

  // average_query = JSON.parse(JSON.stringify(average_query));

  console.log(average_query);

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
