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
