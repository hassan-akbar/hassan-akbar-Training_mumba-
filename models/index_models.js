const Users = require("./Users");
const Tasks = require("./Alloted_tasks");

//assocation
Users.hasMany(Tasks, {
  as: "Tasks",
  foreignKey: "id",
});

Tasks.belongsTo(Users, {
  as: "Users",
  foreignKey: "user_id",
});

//association end

module.exports = {
  Users,
  Tasks,
};
