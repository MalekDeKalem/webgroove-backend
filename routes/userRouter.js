const express = require("express");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const userEntity = require("../entities/userEntity");
const { userService } = require("../services/userService");
const crypto = require("crypto"); //Mudi
const bcrypt = require("bcrypt");

const {
  sendConfirmationEmail,
  sendPasswordResetEmail,
} = require("../services/emailService");

const userRouter = express.Router();
const userServ = new userService();

// Multer Konfiguration (Speicherung im Speicher statt im Dateisystem)
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const upload = multer();
// Middleware zum Hochladen und Validieren
// Check
userRouter.post(
  "/",
  upload.none(), // Verwenden Sie upload.none() für multipart/form-data ohne Datei-Upload
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .isLength({ min: 1, max: 100 }),
    body("username").trim().isString().isLength({ min: 1, max: 100 }),
    body("password").isStrongPassword().isLength({ min: 1, max: 100 }),
  ],
  async (req, res, next) => {
    // Express validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    // const profilePicture = Buffer.from(req.body.profilePicture, 'base64').toString('utf-8');

    // Erstelle das Benutzerobjekt
    const userResource = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      country: req.body.country,
      profilePicture: req.body.profilePicture, // Base64-String zu Buffer umwandeln
    };

    // Falls es die Tabelle in der Datenbank noch nicht gibt, wird sie erstellt
    // await userEntity.sync({});

    // Schaue nach, ob es den Benutzernamen oder die E-Mail bereits gibt
    const findUser = await userEntity.findOne({
      where: { username: userResource.username },
      attributes: [
        "id",
        "username",
        "email",
        "profilePicture",
        "country",
        "createdAt",
        "password",
        "updatedAt",
      ],
    });
    const findEmail = await userEntity.findOne({
      where: { email: userResource.email },
      attributes: [
        "id",
        "username",
        "email",
        "profilePicture",
        "country",
        "createdAt",
        "password",
        "updatedAt",
      ],
    });

    if (!findUser && !findEmail) {
      try {
        const createdUserResource = await userEntity.create(userResource);
        // console.log('Benutzer erfolgreich erstellt:', createdUserResource);
        res.status(201).send({
          message:
            "Bitte bestätigen Sie Ihre E-Mail-Adresse, um die Registrierung abzuschließen.",
        }); // Mudi
        //res.status(201).send(createdUserResource);
      } catch (error) {
        console.error("Fehler beim Erstellen des Benutzers:", error);
        res.status(500).json({ message: "Interner Serverfehler" });
      }
    } else {
      if (findUser) {
        res.status(400).json({ message: "Benutzername existiert bereits" });
      } else {
        res.status(400).json({ message: "E-Mail existiert bereits" });
      }
    }
  }
);

userRouter.get("/getVerifyToken", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await userEntity.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ message: "User nicht gefunden" });
    }
    res.status(200).json({ isVerified: user.isVerified });
  } catch (error) {
    console.error("Fehler beim holen des Verifizierungstoken:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

//Mudi alles neu :
userRouter.get("/verify", async (req, res) => {
  const { token, email } = req.query;

  try {
    const user = await userEntity.findOne({
      where: { email, verificationToken: token },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Ungültiger Verifizierungstoken" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "E-Mail erfolgreich verifiziert!" });
  } catch (error) {
    console.error("Fehler bei der Verifizierung:", error);
    res.status(500).json({ success: false, message: "Interner Serverfehler" });
  }
});

userRouter.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userEntity.findOne({
      where: { id: userId },
      attributes: [
        "id",
        "username",
        "email",
        "profilePicture",
        "country",
        "createdAt",
      ],
    });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }
    // user.profilePicture = Buffer.from(user.profilePicture).toString('base64');
    res.status(200).json(user);
  } catch (error) {
    console.error("Fehler beim Abrufen des Benutzers:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

userRouter.get("/:id/profile-picture", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userEntity.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "Profile picture not found" });
    } else {
      const data = { base64: user.profilePicture };
      res.send(data);
    }
  } catch (error) {
    console.error("Error retrieving profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/sendResetEmail", async (req, res) => {
  const { email } = req.body;
  // console.log(email)
  try {
  const user = await userEntity.findOne({ where: { email: email } });

  const crypto = require("crypto");
  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.verificationToken = verificationToken;
  user.save();
  console.log(user.verificationToken)
  console.log(verificationToken)


  sendPasswordResetEmail(email, verificationToken, user);

  res.status(200).json({message: 'email gesendet', userID: user.id, username: user.username})
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/changePassword/:verificationToken", async (req, res) => {
  const { newPassword, email } = req.body;
  const { verificationToken } = req.params;

  const user = await userEntity.findOne({
    where: { email: email, verificationToken: verificationToken },
  });

  // nayef
  console.log(email, newPassword, verificationToken)
  try {
    const user = await userEntity.findOne({
      where: { email: email, verificationToken: verificationToken },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found / inkorrekter token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update
    userServ.updateUser(user.id, {
      password: hashedPassword,
    });

    res.status(200).json({ message: "Password wurde aktualisiert" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error updating password" });
  }
  //unsicher, ob das noch benötigt wird:
  // user.update
  //!
});

module.exports = userRouter;
