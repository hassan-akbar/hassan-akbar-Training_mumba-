const { report } = require("../routes/Report_routes");
const report_services = require("../services/report.services");

const err_handler = (err) => {
  console.log(err);
};

module.exports.GetUserReports = async (req, res, next) => {
  const user_details = await req.user;

  const report_overview = await report_services.Get_Task_Reports(user_details);

  if (report_overview) {
    res.status(201).send(report_overview);
  } else {
    res.statusa(400),
      send("Invalid pull request, check if user has created tasks");
  }
};

module.exports.GetAverageCompletions = async (req, res, next) => {
  const user_details = await req.user;

  average_completions = report_services
    .Get_Average_Completions(user_details)
    .then((completion_results) => {
      if (completion_results) {
        res.status(200).send(completion_results);
      } else {
        res.status(401).send("Invalid query");
      }
    });
};

module.exports.GetLateCompletions = async (req, res, next) => {
  const user_details = await req.user;

  late_completions = report_services
    .Get_Late_Completions(user_details)
    .then((late_completion_results) => {
      if (late_completion_results) {
        res.status(200).send(late_completion_results);
      } else {
        res.status(401).send("Invalid query");
      }
    });
};

module.exports.GetMaxDayCompletions = async (req, res, next) => {
  report_services.Get_Max_Day_completions(req.user).then((Max_date) => {
    if (Max_date) {
      res.status(200).send(Max_date);
    } else {
      res.status(401).send("error");
    }
  });
};
