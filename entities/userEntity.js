// import { Sequelize, DataTypes } from 'sequelize';
// import { projectEntity } from "./projectEntity"
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("./db-connection");

const { sendConfirmationEmail } = require("../services/emailService"); //mudi
const projectEntity = require("./projectEntity");

//const { sendRegistrationConfirmationEmail} = require("../services/emailService")

// Sequelize-Instanz erstellen, um eine Verbindung zur Datenbank herzustellen.
// 1.Paramater = Datenbankname, 2. = Benutzername, 3. = Passwort
// const sequelize = new Sequelize("postgres", "postgres", "webgroove", {
//   host: "localhost",
//   dialect: "postgres",
// });

const userEntity = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },


  country: {
    type: DataTypes.STRING,
    allowNull: true,
    require: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  profilePicture: {
    type: DataTypes.JSON,
    allowNull: true,
    require: false,
  },

  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: true,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },

  jwt: {
    type: DataTypes.STRING,
    allowNull: true,
    require: false,
  },

  // neu hinzugefügt (Mudi)
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

userEntity.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;

  // neu hinzugefügt (Mudi)
  const crypto = require("crypto");
  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.verificationToken = verificationToken;

  try {
    await sendConfirmationEmail(user.email, verificationToken); // verificationLink hinzugefügt (Mudi)
    //await sendRegistrationConfirmationEmail(user.email);
    // console.log("Bestätigungs-E-Mail gesendet an:", user.email);
  } catch (emailError) {
    console.error("Fehler beim Senden der Bestätigungs-E-Mail:", emailError);
  }
});

// userEntity.hasMany(projectEntity, {foreignKey: 'userid'});

module.exports = userEntity;
// export default userEntity;
