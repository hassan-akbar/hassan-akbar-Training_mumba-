const Sequelize = require("sequelize");
const sequelize = require("../database/connection");

/**
 *
 * Model for tasks
 *
 */
module.exports = sequelize.define(
  "Alloted_Tasks",
  {
    id: {
      type: Sequelize.INTEGER(200),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },

    description: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    attachment: Sequelize.STRING(50),
    creation_date_time: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    due_date_time: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    completed_task: Sequelize.BOOLEAN(),
    task_status: {
      type: Sequelize.ENUM(),
      values: ["active", "pending", "completed"],
    },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        Key: "id",
      },
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  { timestamps: true }
);
