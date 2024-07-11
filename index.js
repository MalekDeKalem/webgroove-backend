const { sequelize } = require("./entities/db-connection.js");
const app = require("./src/app.js")

// localhast starten 

const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`Server läuft auf Port ${PORT}`);

  // Synchronisieren Sie die Modelle
try {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('Datenbank & Tabellen erstellt!');
} catch (err) {
  console.error('Fehler beim Erstellen der Datenbank und Tabellen:', err);
}

});

