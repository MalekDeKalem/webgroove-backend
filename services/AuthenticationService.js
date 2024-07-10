const userEntity = require("../entities/userEntity");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Kf0gUHm2Qo0v5NjX8QzA$67E8bRdU!tW';


/**
 * Prüft den Benutzernamen und das Passwort und generiert ein JWT.
 * Gibt ein Objekt mit `success: true`, `id` und `username` des Benutzers zurück, wenn die Anmeldung erfolgreich ist.
 * Gibt `success: false` zurück, wenn der Benutzer nicht gefunden wurde oder das Passwort falsch ist.
 */
const login = async (username, password) => {
    await userEntity.sync({});
    const findUser = await userEntity.findOne({ where: { username: username } })
    if (!findUser) {
        return ({ success: false })
    }

    
    // console.log("gehashtes Passwort: ", findUser.password,  "| plain text passwort: ",  password)

    const match = await bcrypt.compare(password, findUser.password)
    if (match) {
        // Benutzer erfolgreich authentifiziert, ein JWT generieren und dem user in der Datenbank geben
        const token = jwt.sign({ userId: findUser.id, username: findUser.username }, JWT_SECRET, { expiresIn: '1h' });
        await findUser.update({jwt: token})
        await findUser.save();

        return ({ success: true, id: findUser.id, username: findUser.username, token: token})
    } else { return ({ success: false }) }


}



module.exports = { login }