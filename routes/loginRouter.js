const express = require('express');
const userEntity = require('../entities/userEntity');
const { login } = require('../services/AuthenticationService');
const { userService } = require('../services/userService');
const loginRouter = express.Router();

const user = new userService;

/**
 * POST /
 * 
 * Diese Route ermöglicht es einem Benutzer, sich mit einem Benutzernamen und einem Passwort anzumelden.
 * Wenn die Anmeldung erfolgreich ist, wird der Username, die entsprechen UserId und sein JSON-Web-Token (JWT) den Benutzer zurückgegeben.
 */
loginRouter.post("/",
    async (req, res, next) => {
        try {
            const username = req.body.username
            const password = req.body.password

            const loginData = await login(username,password)
            if (loginData.success == false) {
                // console.log(loginData)
                // console.log("Username oder Passwort ist falsch")
                res.status(400).json({ message: "Username oder Passwort ist falsch" })
            } else {
                // console.log("Erfolgreich angemeldet")
                // console.log(loginData);
                return res.status(200).json({ loginData });
            }
        } catch (error) {
            // console.log("Fehler beim login:", error)
            res.status(500).json({ message: "Interner Serverfehler" })
        }
    }
)

loginRouter.get("/auth", 
    async (req, res) => {

        try{
            const { userId, jwtToken } = req.query;
            // console.log(userId,jwtToken)
            const isValid = await user.compareJWT(userId, jwtToken);
            if (isValid.success) {
                return res.status(200).json({ message: "Authentifizierung erfolgreich" });
            } else {
                return res.status(401).json({ message: "Ungültiges Token oder Benutzer-ID" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Interner Serverfehler" });
        }
    });
// login
module.exports = loginRouter


