const { Sequelize, DataTypes } = require('sequelize');
const userEntity = require("./userEntity");
const projectEntity = require('./projectEntity');
const stepsequencerEntity = require('./stepsequencerEntity');
const drummachineEntity = require('./drummachineEntity');
const { sequelize } = require('./db-connection');


// const sequelize = new Sequelize("postgres", "postgres", "webgroove", {
//     host: "localhost",
//     dialect: "postgres",
//   });

const effectEntity = sequelize.define('Drummachine', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
    , type: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    description: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    }
});


// effectEntity.belongsTo(stepsequencerEntity);
// effectEntity.belongsTo(drummachineEntity);

// module.exports = effectEntity;
module.exports = effectEntity;