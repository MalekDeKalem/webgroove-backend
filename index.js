const { sequelize } = require("./entities/db-connection.js");
const app = require("./src/app.js")

   // localhast starten 
   
    const PORT = process.env.PORT || 3999;
    app.listen(PORT, () => {
      console.log(`Server läuft auf Port ${PORT}`);
    });
  
// Synchronisieren Sie die Modelle
sequelize.sync().then(() => {
  console.log('Datenbank & Tabellen erstellt!');
}).catch(err => {
  console.log('Fehler beim Erstellen der Datenbank und Tabellen:', err);
});

