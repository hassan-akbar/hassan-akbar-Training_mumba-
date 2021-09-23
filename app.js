const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5500;
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Alive");
});

app.use("/api", require("./routes/api_routes"));

app.listen(
  PORT,
  () => {
    console.log(`Live at : http://localhost:${PORT}`);
  },
  require("./middleware/cronjobs.middleware").DailyPendingTasks
);
