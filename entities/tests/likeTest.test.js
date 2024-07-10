const express = require("express");
const request = require("supertest");
const bcrypt = require("bcrypt");
const userEntity = require("../../entities/userEntity");
const { userService } = require("../../services/userService");
const userRouter = require("../../routes/userRouter");

// Mock für bcrypt
jest.mock("bcrypt");
bcrypt.hash.mockResolvedValue("hashedNewPassword");

// Mock für userEntity
jest.mock("../../entities/userEntity");
userEntity.findOne = jest.fn();
userEntity.findByPk = jest.fn();
userEntity.create = jest.fn();

// Mock für userService
jest.mock("../../services/userService");
const userServ = new userService();
userServ.updateUser = jest.fn();

userServ.updateUser.mockImplementation(async (userId, newData) => {
  if (userId !== 1) {
    throw new Error("User not found");
  }
  return { id: userId, ...newData };
});

// Express-Anwendung für Tests
const app = express();
app.use(express.json());
app.use("/user", userRouter);

// Testdaten für neuen Benutzer
const newUser = {
  id: 1,
  email: "pikachu@example.com",
  username: "Pikachu",
  password: "PikachuStrongPassword1234", // Starkes Passwort mit mindestens 20 Zeichen
  verificationToken: "valid-token",
};

const newPassword = "StrongNewPassword1234!@#$"; // Starkes neues Passwort mit mindestens 20 Zeichen
const newPasswordHash = "hashedNewPassword";

// Test: Neuen Benutzer erstellen und Passwort ändern
test("Neuen Benutzer erstellen und Passwort ändern", async () => {
  // Benutzer erstellen
  userEntity.findOne.mockResolvedValueOnce(null); // Stellen Sie sicher, dass kein Benutzer gefunden wird
  userEntity.create.mockResolvedValue(newUser);

  const createUserResponse = await request(app).post("/user").send({
    email: newUser.email,
    username: newUser.username,
    password: newUser.password,
    country: "Kanto",
    profilePicture: "base64ProfilePic",
  });

  // expect(createUserResponse.status).toBe(201);
  // expect(createUserResponse.body.message).toBe(
  //   "Bitte bestätigen Sie Ihre E-Mail-Adresse, um die Registrierung abzuschließen."
  // );

  // Passwort ändern
  userEntity.findOne.mockResolvedValueOnce(newUser);

  const changePasswordResponse = await request(app)
    .post(`/user/changePassword/${newUser.verificationToken}`)
    .send({ email: newUser.email, newPassword });

  expect(changePasswordResponse.status).toBe(200);
  expect(changePasswordResponse.body.message).toBe(
    "Password wurde aktualisiert"
  );

  // Überprüfen, ob bcrypt.hash aufgerufen wurde
  expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);

  // Überprüfen, ob updateUser aufgerufen wurde
  // expect(userServ.updateUser).toHaveBeenCalledWith(newUser.id, {
  //   password: newPasswordHash,
  //   verificationToken: null,
  // });
});

// Test: Benutzer nicht gefunden
test("Benutzer nicht gefunden", async () => {
  userEntity.findOne.mockResolvedValue(null);

  const response = await request(app)
    .post(`/user/changePassword/${newUser.verificationToken}`)
    .send({ email: newUser.email, newPassword });

  expect(response.status).toBe(404);
  expect(response.body.message).toBe("User not found / inkorrekter token");
});

// Test: Fehler beim Passwort-Hashing
test("Fehler beim Passwort-Hashing", async () => {
  bcrypt.hash.mockRejectedValue(new Error("Hashing error"));
  userEntity.findOne.mockResolvedValue(newUser);

  const response = await request(app)
    .post(`/user/changePassword/${newUser.verificationToken}`)
    .send({ email: newUser.email, newPassword });

  expect(response.status).toBe(500);
  expect(response.body.message).toBe("Error updating password");
});
