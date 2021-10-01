const express = require("express");
const report_controller = require("../controllers/report_controller");
const AuthenticationMiddleware =
  require("../middleware/authentication.middleware").VerifyToken;

const router = express();

router.get("/", (req, res) => {
  res.send("hello this page is alive");
});

router.get(
  "/total_tasks",
  AuthenticationMiddleware,
  report_controller.GetUserReports
);

router.get(
  "/average_completed_tasks",
  AuthenticationMiddleware,
  report_controller.GetAverageCompletions
);

router.get(
  "/late_completions",
  AuthenticationMiddleware,
  report_controller.GetLateCompletions
);

router.get(
  "/max_completions_day",
  AuthenticationMiddleware,
  report_controller.GetMaxDayCompletions
);

router.get(
  "/day_info_reports",
  AuthenticationMiddleware,
  report_controller.GetPerDayCreationReports
);
module.exports = router;
