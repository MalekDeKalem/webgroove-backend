const { Sequelize, DataTypes } = require('sequelize');
const userEntity = require("./userEntity");
const drummachineEntity = require('./drummachineEntity');
const stepsequencerEntity = require('./stepsequencerEntity');
const { sequelize } = require('./db-connection');


// const sequelize = new Sequelize("postgres", "postgres", "webgroove", {
//     host: "localhost",
//     dialect: "postgres",
//   });
  
  const projectEntity = sequelize.define("Project", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 255], // Zeichenbeschränkung
      },
    },
    bpm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isImportable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
  
  // projectEntity.belongsTo(users, {foreignKey: 'userId' }); // Ein Projekt gehört zu einem Benutzer
// projectEntity.hasOne(drummachineEntity); // Exakt eine Drummachine zum Projekt
// projectEntity.hasOne(stepsequencerEntity); // Exakt eine Drummachine zum S-Sequencer
// projectEntity.associate = (models) => {
//   projectEntity.belongsTo(models.Users, {foreignKey: 'userId' })
// }



module.exports = projectEntity;
// export default projectEntity;