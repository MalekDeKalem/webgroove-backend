const { Sequelize, DataTypes } = require('sequelize');


const dbHost = process.env.POSTGRES_HOST || 'localhost';

module.exports.sequelize = new Sequelize("postgres", "postgres", "webgroove", {
    host: dbHost,
    dialect: "postgres",
    logging: false,
  });
  