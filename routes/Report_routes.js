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

module.exports = router;
