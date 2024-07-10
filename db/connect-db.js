module.exports = {
    development: {
      username: 'postgres', // Dein PostgreSQL-Benutzername
      password: 'webgroove', // Dein PostgreSQL-Passwort
      database: 'Projekt', // Der Name deiner PostgreSQL-Datenbank
      host: 'localhost', // Der Hostname, normalerweise "localhost"
      dialect: 'postgres' // Der Dialekt für Sequelize (PostgreSQL)
    }
  };


  const Sequelize = require('sequelize');
const config = require('c:\Users\MSafw\Desktop\Projekt Webgroove\webgroove\backend\db\database.js'); // Passe den Pfad entsprechend der Struktur deines Projekts an


const sequelize = new Sequelize(config.development);


sequelize.authenticate()
  .then(() => {
    console.log('Verbindung zur Datenbank hergestellt.');
  })
  .catch(err => {
    console.error('Fehler beim Herstellen der Verbindung zur Datenbank:', err);
  });
