"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("Users", {
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
      OauthUser: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("Users");
  },
};
