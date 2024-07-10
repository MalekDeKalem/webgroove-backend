//https://www.npmjs.com/package/nodemailer

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

dotenv.config();

// Dummy user data (normalerweise aus einer Datenbank)
const users = [
  {
    id: 1,
    email: "user@example.com",
    password: "$2b$10$QdYPhW6jTf.I3dYQHiyGaeDJYmSyBOY8Ed8/1PvCTUp0yo7k/WJda", // Passwort: 'password' (gehashed)
  },
];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (email, subject, text, html) => {
  const mailOptions = {
    from: '"WebGroove" <webgroove.bht@gmail.com>',
    to: email,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log("E-Mail gesendet: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Fehler beim Senden der E-Mail:", error);
  }
};

// Mudi
const sendConfirmationEmail = (email, verificationToken) => {
  // console.log(process.env.EMAIL_USER);
  // const verificationLink = `http://localhost:3999/api/user/verify?token=${verificationToken}&email=${email}`;
  const verificationLink = `http://localhost:5173/emailVerification?token=${verificationToken}&email=${email}`;

  const mailOptions = {
    from: '"WebGroove" <webgroove.bht@gmail.com>',
    to: email,
    subject: "Bestätigungs-E-Mail",
    text: `Danke für Ihre Registrierung! Bitte klicken Sie auf den folgenden Link, um Ihre E-Mail-Adresse zu bestätigen: ${verificationLink}`,
    html: `<p>Hallo,</p>
    <p>vielen Dank, dass Sie sich bei <strong>WebGroove</strong> registriert haben! Um Ihre Registrierung abzuschließen, klicken Sie bitte auf den unten stehenden Link, um Ihre E-Mail-Adresse zu bestätigen:</p>
    <p><a href="${verificationLink}">E-Mail-Adresse bestätigen</a></p>
    <p>Falls Sie diese E-Mail irrtümlich erhalten haben, ignorieren Sie diese bitte.</p>
    
    <p>herzlich willkommen bei <strong>WebGroove</strong>!</p>
    <p>Wir freuen uns sehr, dass du dich für unseren Synthesizer entschieden hast und nun Teil unserer kreativen Community bist. Mit WebGroove hast du nun Zugriff auf eine Vielzahl von Sounds, Effekten und Tools, um deine musikalischen Ideen in die Realität umzusetzen.</p>
    <p>Hier sind einige erste Schritte, um das Beste aus deiner Erfahrung herauszuholen:</p>
    <ul>
        <li><strong>Einloggen:</strong> Besuche die WebGroove Website und logge dich mit deinen Zugangsdaten ein.</li>
        <li><strong>Community:</strong> Trete unserer bei, um dich mit anderen Musikern auszutauschen, Tipps zu bekommen und deine Kreationen zu teilen.</li>
        <li><strong>Support:</strong> Bei Fragen oder Problemen steht dir unser Support-Team jederzeit zur Verfügung. Kontaktiere uns einfach über <a href="mailto:webgroove.bht@gmail.com">webgroove.bht@gmail.com</a>.</li>
    </ul>
    <p>Wir sind gespannt auf deine musikalischen Werke und wünschen dir viel Spaß und Erfolg beim Experimentieren mit WebGroove.</p>
    
    <p>Mit freundlichen Grüßen,<br>
    Das WebGroove-Team</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
};
//bis hier

// const sendRegistrationConfirmationEmail = async (email, confirmationLink) => {
//   try {
//     const mailOptions = {
//       from: '"WebGroove" <webgroove.bht@gmail.com>',
//       to: email,
//       subject: "Registration Confirmation",
//       text: `Please confirm your registration by clicking the following link: ${confirmationLink}`,
//       html: `<p>Please confirm your registration by clicking the following link: <a href="${confirmationLink}">${confirmationLink}</a></p>`,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: " + info.response);
//     return info;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error; // Weiterwerfen des Fehlers für die Fehlerbehandlung im aufrufenden Code
//   }
// };

//Alt
// const sendPasswordResetEmail = (email, resetLink) => {
//   const subject = "Password Reset";
//   const text = `You requested a password reset. Click the following link to reset your password: ${resetLink}`;
//   const html = `<p>You requested a password reset. Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`;
//   return sendEmail(email, subject, text, html);
// };

//Neu
const sendPasswordResetEmail = async (email, verificationToken, user) => {
  const subject = "Password Reset";
  const verificationLink = `http://localhost:5173/resetPassword?token=${verificationToken}&email=${email}&username=${user.username}`;
  const text = `Du hast das Passwortreset eingeleitet. Klicke auf den folgenden Link, um es auszuführen: ${verificationLink}`;
  const html = `<p>Du hast das Passwortreset eingeleitet. Klicke auf den folgenden Link, um es auszuführen: <a href="${verificationLink}">Reset Passwort</a></p>`;
  await sendEmail(email, subject, text, html);
};

const generateToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.error("Fehler beim Hashen des Passworts:", error);
    throw error;
  }
};

const findUserByEmail = (email) => {
  return users.find((u) => u.email === email);
};

const findUserById = (id) => {
  return users.find((u) => u.id === id);
};

module.exports = {
  sendConfirmationEmail, //mudi
  //sendRegistrationConfirmationEmail,
  sendPasswordResetEmail,
  generateToken,
  verifyToken,
  hashPassword,
  findUserByEmail,
  findUserById,
};
