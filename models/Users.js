const Sequelize = require("sequelize");
const sequelize = require("../database/connection");

//User Schemma

module.exports = sequelize.define(
  "Users",
  {
    id: {
      type: Sequelize.INTEGER(200), //limiting the users to 200 for this test run
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    username: Sequelize.STRING(64),
    email: {
      type: Sequelize.STRING(254), //maximum length of an email
      allowNull: false,
    },
    passwd: {
      type: Sequelize.STRING(128),
      allowNull: false,
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
