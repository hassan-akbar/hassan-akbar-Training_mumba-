const report_services = require("../services/report.services");
const logger = require("../logger/winston_logger");

const err_handler = (err) => {
  logger.error(err.stack);
};

const info_logger = (req, Type, function_call) => {
  const message = `Route :${req.route.path} ---> Type: ${Type} ---> User:${
    req.user.email
  } ---> ${function_call} ---> Method:${JSON.stringify(req.route.methods)}`;

  logger.info(JSON.stringify(message), { service: "report.services.js" });
};

module.exports.GetUserReports = async (req, res, next) => {
  const user_details = await req.user;
  info_logger(req, "Request", "report_services.Get_Task_Reports");

  const report_overview = await report_services.Get_Task_Reports(user_details);

  info_logger(
    req,
    "Response",
    `report_services.Get${JSON.stringify(report_overview)}`
  );
  if (report_overview) {
    res.status(201).send(report_overview);
  } else {
    res.statusa(400),
      send("Invalid pull request, check if user has created tasks");
  }
};

module.exports.GetAverageCompletions = async (req, res, next) => {
  const user_details = await req.user;
  info_logger(req, "Request", "report_services.Get_Average_Completions");

  average_completions = report_services
    .Get_Average_Completions(user_details)
    .then((completion_results) => {
      info_logger(
        req,
        "Response",
        `report_services.Get_Average_Completions ${JSON.stringify(
          completion_results
        )}`
      );
      if (completion_results) {
        res.status(200).send(completion_results);
      } else {
        res.status(401).send("Invalid query");
      }
    })
    .catch(err_handler);
};

module.exports.GetLateCompletions = async (req, res, next) => {
  const user_details = await req.user;
  info_logger(req, "Request", "report_services.Get_Late_Completions");
  late_completions = report_services
    .Get_Late_Completions(user_details)
    .then((late_completion_results) => {
      info_logger(
        req,
        "Response",
        `report_services.Get_Late_Completions ${JSON.stringify(
          late_completion_results
        )}`
      );
      if (late_completion_results) {
        res.status(200).send(late_completion_results);
      } else {
        res.status(401).send("Invalid query");
      }
    })
    .catch(err_handler);
};

module.exports.GetMaxDayCompletions = async (req, res, next) => {
  info_logger(req, "Request", "report_services.Get_Max_Dat_completions");
  report_services.Get_Max_Day_completions(req.user).then((Max_date) => {
    info_logger(
      req,
      "Response",
      `report_services.Get_Max_Day_completions ${JSON.stringify(Max_date)}`
    );
    if (Max_date) {
      res.status(200).send(Max_date);
    } else {
      res.status(401).send("error");
    }
  });
};

module.exports.GetPerDayCreationReports = async (req, res, next) => {
  info_logger(req, "Request", "report_services.Get_Perday_Creation_Reports");
  report_services
    .Get_Perday_Creation_Reports(req.user)
    .then((per_day_response) => {
      info_logger(
        req,
        "Response",
        `report_services.Get_Perday_Creation_Reports ${JSON.stringify(
          per_day_response
        )}`
      );
      if (per_day_response) {
        res.status(200).send(per_day_response);
      } else {
        res.status(401).send("error");
      }
    });
};
