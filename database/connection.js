const Sequelize = require("sequelize");

let log_val = true;
if (process.env.NODE_ENV === "test") {
  log_val = false;
}

const sequelize = new Sequelize("TASK_MANAGER_DB", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
  operatorsAliases: false,
  logging: log_val,
});

module.exports = sequelize;
global.sequelize = sequelize;
