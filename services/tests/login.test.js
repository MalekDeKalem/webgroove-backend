const { sequelize } = require("../../entities/db-connection");
const userEntity = require("../../entities/userEntity");
const { login } = require("../AuthenticationService");

describe("Login Tests", () => {
  beforeAll(async () => {
    // Vor dem Test: Erstelle einen Benutzer für den Login-Test
    // await userEntity.sync({ force: true });
    await sequelize.sync({force: true})
  });

  it("should return success true and user data if username and password are correct", async () => {
    // Gültige Anmeldeinformationen
    const username = "loginuser";
    const password = "password123";
    await userEntity.create({
      username: "loginuser",
      email: "login@testfdsasdff.com",
      password: "password123",
    });

    // Aufrufen der login-Funktion
    const result = await login(username, password);

    // Überprüfen, ob die login-Funktion das erwartete Ergebnis zurückgibt
    expect(result).toEqual({
      success: true,
      id: expect.any(Number),
      token: expect.any(String),
      username: "loginuser",
    });
  });

  it("should return success false if username or password are incorrect", async () => {
    // Ungültige Anmeldeinformationen
    const username = "wronguser";
    const password = "wrongpassword";

    // Aufrufen der login-Funktion
    const result = await login(username, password);

    // Überprüfen, ob die login-Funktion das erwartete Ergebnis zurückgibt
    expect(result).toEqual({ success: false });
  });

  afterAll(() => {
    sequelize.close();
  });
});
