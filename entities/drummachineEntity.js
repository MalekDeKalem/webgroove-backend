const { Sequelize, DataTypes } =require('sequelize') ;
const userEntity = require("../entities/userEntity");
const projectEntity  = require('./projectEntity') ;
const { mixerEntity } = require('./mixerEntity');
const { effectEntity } = require("./effectEntity") 
const { sequelize } = require('./db-connection');


// const sequelize = new Sequelize("postgres", "postgres", "webgroove", {
//     host: "localhost",
//     dialect: "postgres",
//   });
  
const drummachineEntity = sequelize.define('Drummachine', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },

    patternName: {
        type: DataTypes.STRING,
        allowNull: true
    },
      
    drumSequence: {
        type: DataTypes.JSON,
        allowNull: true
    },
//
    gainDrum: {
        type: DataTypes.JSON,
        allowNull: true
    }, 

    panDrum: {
        type: DataTypes.JSON,
        allowNull: true
    }, 

    soloDrum: {
        type: DataTypes.JSON,
        allowNull: true
    }, 

    muteDrum: {
        type: DataTypes.JSON,
        allowNull: true
    }, 

    effectDrum: {
        type: DataTypes.JSON,
        allowNull: true
    }, 
//
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },


});

// drummachineEntity.belongsTo(userEntity, { foreignKey: 'userId' })
// drummachineEntity.belongsTo(projectEntity, {foreignKey: "projectId"})

// drummachineEntity.hasOne(projectEntity); // One Drummachine - One Project
// drummachineEntity.hasOne(mixerEntity); // One D - One P
// drummachineEntity.hasMany(effectEntity);

// module.exports = drummachineEntity;
module.exports = drummachineEntity;