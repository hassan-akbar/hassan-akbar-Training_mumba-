const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("hello this is the api page");
});

router.use("/users", require("./User_routes"));

router.use("/tasks", require("./Tasks_routes"));

router.use("/reports", require("./Report_routes"));

module.exports = router;
