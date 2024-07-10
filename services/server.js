const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const {
  //sendRegistrationConfirmationEmail,
  sendPasswordResetEmail,
  generateToken,
  verifyToken,
  hashPassword,
  findUserByEmail,
  findUserById,
} = require("./emailService");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (findUserByEmail(email)) {
    return res.status(400).send("User already exists.");
  }

  // Hash password and save
  const hashedPassword = await hashPassword(password);
  const userId = users.length + 1;
  const newUser = { id: userId, email, password: hashedPassword };
  users.push(newUser);

  // Generate confirmation token
  const token = generateToken({ id: userId }, "1d");
  const confirmationLink = `${req.protocol}://${req.get(
    "host"
  )}/confirm/${token}`;

  // confirmation email
  //await sendRegistrationConfirmationEmail(email, confirmationLink);

  res.send(
    "Registration successful. Please check your email to confirm your registration."
  );
});

app.get("/confirm/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = await verifyToken(token);
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(400).send("Invalid token.");
    }

    // Handle user confirmation (dummy implementation)

    res.send("Registration confirmed. You can now log in.");
  } catch (error) {
    res.status(400).send("Invalid or expired token.");
  }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(400).send("User not found.");
  }

  try {
    // Generate reset token and link
    const token = generateToken({ id: user.id }, "1h");
    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${token}`;

    // Send password reset email
    await sendPasswordResetEmail(transporter, email, resetLink);

    res.send("Password reset link sent. Please check your email.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).send("Error sending password reset email.");
  }
});

app.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = await verifyToken(token);
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(400).send("Invalid token.");
    }

    res.send("Token is valid. You can now reset your password.");
  } catch (error) {
    res.status(400).send("Invalid or expired token.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
