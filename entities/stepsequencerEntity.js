const { Sequelize, DataTypes, FLOAT } = require('sequelize');
const userEntity = require("./userEntity");
const projectEntity = require('./projectEntity');
const drummachineEntity = require('./drummachineEntity');
const effectEntity = require('./effectEntity');
const { sequelize } = require('./db-connection');

// const sequelize = new Sequelize("postgres", "postgres", "webgroove", {
//     host: "localhost",
//     dialect: "postgres",
//   });
  
  const stepsequencerEntity = sequelize.define("SynthPattern", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
  
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
   
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  
    stepSequence: {
      type: DataTypes.JSON,
      allowNull: true
    },
  
    transpose: {
      type: DataTypes.JSON,
      allowNull: true
    },
    scale: {
      type: DataTypes.JSON,
      allowNull: true
    },
    volume: {
      type: DataTypes.JSON,
      allowNull: true
    },

    pitch: {
      type: DataTypes.JSON,
      allowNull: true
    },
    pan: {
      type: DataTypes.JSON,
      allowNull: true
    },
    adsr: {
      type: DataTypes.JSON,
      allowNull: true
    },

    effectSynth: {
      type: DataTypes.JSON,
      allowNull: true
    },
    waveTableIndex: {
      type: DataTypes.JSON,
      allowNull: true
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  })
  
  // stepsequencerEntity.belongsTo(userEntity, { foreignKey: 'userId' }); // Ein SynthPattern gehört zu einem Benutzer
  


// stepsequencerEntity.hasOne(projectEntity);
// stepsequencerEntity.hasMany(effectEntity);

module.exports = stepsequencerEntity;
// export default stepsequencerEntity;