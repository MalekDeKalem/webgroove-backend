const express = require("express");
const router = express.Router();
const effectEntity = require("./effectEntity");

// Erstellen eines neuen Effekts (POST)
effectRouter.post("/", async (req, res) => {
  try {
    const { name, type, description } = req.body;
    const effect = await effectEntity.create({ name, type, description });
    res.status(201).json(effect);
  } catch (error) {
    console.error("Fehler beim Erstellen des Effekts:", error);
    res.status(500).json({ error: "Fehler beim Erstellen des Effekts" });
  }
});

// Abrufen aller Effekte (GET)
effectRouter.get("/", async (req, res) => {
  try {
    const effects = await effectEntity.findAll();
    res.status(200).json(effects);
  } catch (error) {
    console.error("Fehler beim Abrufen der Effekte:", error);
    res.status(500).json({ error: "Fehler beim Abrufen der Effekte" });
  }
});

// Abrufen eines Effekts nach ID (GET)
effectRouter.get("/:id", async (req, res) => {
  try {
    const effect = await effectEntity.findByPk(req.params.id);
    if (effect) {
      res.status(200).json(effect);
    } else {
      res.status(404).json({ error: "Effekt nicht gefunden" });
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des Effekts:", error);
    res.status(500).json({ error: "Fehler beim Abrufen des Effekts" });
  }
});

// Aktualisieren eines Effekts (PUT)
effectRouter.put("/:id", async (req, res) => {
  try {
    const { name, type, description } = req.body;
    const effect = await effectEntity.findByPk(req.params.id);
    if (effect) {
      effect.name = name || effect.name;
      effect.type = type || effect.type;
      effect.description = description || effect.description;
      await effect.save();
      res.status(200).json(effect);
    } else {
      res.status(404).json({ error: "Effekt nicht gefunden" });
    }
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Effekts:", error);
    res.status(500).json({ error: "Fehler beim Aktualisieren des Effekts" });
  }
});

// Löschen eines Effekts (DELETE)
effectRouter.delete("/:id", async (req, res) => {
  try {
    const effect = await effectEntity.findByPk(req.params.id);
    if (effect) {
      await effect.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Effekt nicht gefunden" });
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Effekts:", error);
    res.status(500).json({ error: "Fehler beim Löschen des Effekts" });
  }
});

module.exports = router;
