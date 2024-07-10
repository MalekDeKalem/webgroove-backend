const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("./db-connection");


    const Like = sequelize.define('Like', {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      projectId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Projects',
          key: 'id'
        }
      }
    });
  
module.exports = Like