const { Sequelize, DataTypes } = require('sequelize');
const userEntity = require("./userEntity");
const projectEntity = require('./projectEntity');
const drummachineEntity = require('./drummachineEntity');
const { sequelize } = require('./db-connection');


// const sequelize = new Sequelize("postgres", "postgres", "webgroove", {
//     host: "localhost",
//     dialect: "postgres",
//   });

const mixerEntity = sequelize.define('Mixer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    panlist: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        allowNull: true
    }
});


// mixerEntity.hasOne(drummachineEntity);

module.exports = mixerEntity;
// export default mixerEntity;