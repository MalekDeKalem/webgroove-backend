const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { sendConfirmationEmail } = require("../services/emailService");
const { userService } = require("../services/userService");

const userSvc = new userService;


// Erstellen
router.post("/", async (req, res) => {
  try {
    const { username, email, password, profilePicture, country } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userSvc.createUser(
      username,
      email,
      profilePicture,
      hashedPassword,
      country
    );
    res.status(201).json(user);
  } catch (error) {
    console.error("Fehler beim Erstellen des Benutzers:", error);
    res.status(500).json({ error: "Fehler beim Erstellen des Benutzers" });
  }
});

// Abrufen aller Benutzer
router.get("/", async (req, res) => {
  try {
    const users = await userSvc.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzer:", error);
    res.status(500).json({ error: "Fehler beim Abrufen der Benutzer" });
  }
});

// // Abrufen
router.get("/:id", async (req, res) => {
  try {
    const user = await userSvc.getUserById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "Benutzer nicht gefunden" });
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des Benutzers:", error);
    res.status(500).json({ error: "Fehler beim Abrufen des Benutzers" });
  }
});

// Aktualisieren
router.put("/:id", async (req, res) => {
  try {
    const { username, email, password, profilePicture, country } = req.body;
    console.log(
      username,
      email,
      password,
      profilePicture,
      country,
      req.params.id
    );
    const user = await userSvc.getUserById(req.params.id);
    if (user) {
      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : user.password;
      const updatedUser = await userSvc.updateUser(req.params.id, {
        username,
        email,
        profilePicture,
        country,
        password: hashedPassword,
      });
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: "Benutzer nicht gefunden" });
    }
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Benutzers:", error);
    res.status(500).json({ error: "Fehler beim Aktualisieren des Benutzers" });
  }
});

// Löschen
router.delete("/:id", async (req, res) => {
  try {
    const user = await userSvc.deleteUser(req.params.id);
    if (user) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Benutzer nicht gefunden" });
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Benutzers:", error);
    res.status(500).json({ error: "Fehler beim Löschen des Benutzers" });
  }
});

module.exports = router;
