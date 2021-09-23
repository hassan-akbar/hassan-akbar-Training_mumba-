const express = require("express");

const daily_cron_jobs =
  require("../middleware/cronjobs.middleware").DailyPendingTasks;
const router = express.Router();

router.use(daily_cron_jobs);
router.get("/", (req, res) => {
  res.send("hello this is the api page");
});

router.use("/users", require("./User_routes"));

router.use("/tasks", require("./Tasks_routes"));

router.use("/reports", require("./Report_routes"));

module.exports = router;
