const express = require("express");
const report_controller = require("../controllers/report_controller");
const AuthenticationMiddleware = require("../middleware/authentication.middleware");

const router = express();

router.get("/", (req, res) => {
  res.send("hello this page is alive");
});

router.get(
  "/total_tasks",
  AuthenticationMiddleware.VerifyToken,
  report_controller.GetUserReports
);

router.get(
  "/averge_completed_tasks",
  AuthenticationMiddleware.VerifyToken,
  report_controller.GetAverageCompletions
);

router.get(
  "/late_completions",
  AuthenticationMiddleware.VerifyToken,
  report_controller.GetLateCompletions
);

router.get(
  "/max_completions_day",
  AuthenticationMiddleware.VerifyToken,
  report_controller.GetMaxDayCompletions
);
module.exports = router;
