const report_services = require("../services/report.services");

const err_handler = (err) => {
  console.log(err);
};

module.exports.GetUserReports = async (req, res, next) => {
  const user_details = await req.user;

  const report_overview = await report_services.Get_Task_reports(user_details);

  if (report_overview) {
    res.status(201).send(report_overview);
  } else {
    res.statusa(400),
      send("Invalid pull request, check if user has created tasks");
  }
};

module.exports.GetAverageCompletions = async (req, res, next) => {
  const user_details = await req.user;

  const average_completions = report_services
    .Get_Average_completions(user_details)
    .then((completion_results) => {
      if (completion_results) {
        res.status(200).send(completion_results);
      } else {
        res.status(401).send("Invalid query");
      }
    });
};
