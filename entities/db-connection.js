const { Sequelize, DataTypes } = require('sequelize');


// const dbHost = process.env.POSTGRES_HOST || 'localhost';

module.exports.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD , {
    host: process.env.DB_HOST,
    dialect: "postgres",
    // logging: false,
  });
  