const request = require("supertest");
const express = require("express");
const userRouter = require("../../routes/userRouter");
const userEntity = require("../userEntity");
const { Sequelize } = require("sequelize");
const sequelize = require("../../db/database"); // assuming you have a sequelize instance exported from your db-connection
const supertest = require("supertest");
const app = require("../../src/app");

//Passwort muss stark sein
//User muss einzigartig sein
describe("User Router Tests", () => {
  beforeAll(async () => {
    await userEntity.sync({ force: true });
  });

  it("should create a new user", async () => {
    const user = await userEntity.create({
      username: "personperson",
      email: "test@fame.de",
      password: "123456123456",
    });
    expect(user).toBeTruthy();
    expect(user.username).toBe("personperson");
    expect(user.email).toBe("test@fame.de");
  });
  it("create user, Post Positiv", async () => {
    const userData = {
      username: "Moha",
      email: "moha@gmail.com",
      password: "hdjckndjhbUGHJBKGVtr45$",
    };
    const testee = supertest(app);
    const response = await testee.post("/api/user").send(userData);
    expect(response.status).toBe(201);
  });
  it("create user, Post Negativ Password", async () => {
    const userData = {
      username: "Moha1",
      email: "moha1@gmail.com",
      password: "1234",
    };
    const testee = supertest(app);
    const response = await testee.post("/api/user").send(userData);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  it("create user, Post Negativ Name", async () => {
    const userData = {
      username: "",
      email: "moha1@gmail.com",
      password: "hdjckndjhbUGHJBKGVtr45$",
    };
    const testee = supertest(app);
    const response = await testee.post("/api/user").send(userData);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  it("create user, Post Negativ Email", async () => {
    const userData = {
      username: "Moha3",
      email: "moha1",
      password: "hdjckndjhbUGHJBKGVtr45$",
    };
    const testee = supertest(app);
    const response = await testee.post("/api/user").send(userData);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  it("create user, Negativ existing email", async () => {
    const userData = {
      username: "Moha3",
      email: "moha@gmail.com",
      password: "hdjckndjhbUGHJBKGVtr45$",
    };
    const testee = supertest(app);
    const response = await testee.post("/api/user").send(userData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("E-Mail existiert bereits");
  });
  it("create user, Negativ existing BenutzerName", async () => {
    const userData = {
      username: "Moha",
      email: "moha1@gmail.com",
      password: "hdjckndjhbUGHJBKGVtr45$",
    };
    const testee = supertest(app);
    const response = await testee.post("/api/user").send(userData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Benutzername existiert bereits");
  });

  it("should fetch the verification status of an existing user", async () => {
    const userData = {
      username: "VerifiedUser",
      email: "verified@gmail.com",
      password: "strongPassword$123",
    };

    // Create a user first
    const testee = supertest(app);
    const createUserResponse = await testee.post("/api/user").send(userData);

    expect(createUserResponse.status).toBe(201);

    // Fetch the created user to get the userId
    const createdUser = await userEntity.findOne({
      where: { email: userData.email },
    });

    // Get verification status
    const verifyTokenResponse = await testee
      .get(`/api/user/getVerifyToken`)
      .query({ userId: createdUser.id });

    expect(verifyTokenResponse.status).toBe(200);
    expect(verifyTokenResponse.body.isVerified).toBe(false); // Assuming user is not verified initially
  });

  it("should return an error for a non-existing user", async () => {
    // Attempt to fetch verification status for a non-existing user
    const testee = supertest(app);
    const verifyTokenResponse = await testee
      .get(`/api/user/getVerifyToken`)
      .query({ userId: 9999 }); // Using a non-existing userId

    expect(verifyTokenResponse.status).toBe(400);
    expect(verifyTokenResponse.body.message).toBe("User nicht gefunden");
  });

  it("should fetch the profile of an existing user", async () => {
    const userData = {
      username: "TestUserProfi",
      email: "testuser1@gmail.com",
      password: "testPassword$123",
      country: "Germany",
    };

    // Create a user first
    const testee = supertest(app);
    const createUserResponse = await testee.post("/api/user").send(userData);

    expect(createUserResponse.status).toBe(201);

    // Fetch the created user to get the userId
    const createdUser = await userEntity.findOne({
      where: { email: userData.email },
    });

    // Get user profile
    const profileResponse = await testee.get(
      `/api/user/profile/${createdUser.id}`
    );

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toEqual({
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      profilePicture: createdUser.profilePicture,
      country: createdUser.country,
      createdAt: createdUser.createdAt.toISOString(),
    });
  });

  it("should return an error for a non-existing user profile", async () => {
    // Attempt to fetch profile for a non-existing user
    const testee = supertest(app);
    const profileResponse = await testee.get(`/api/user/profile/9999`); // Using a non-existing userId

    expect(profileResponse.status).toBe(404);
    expect(profileResponse.body.message).toBe("Benutzer nicht gefunden");
  });

  it("should return an error for invalid verification token", async () => {
    const userData = {
      username: "InvalidTokenUser",
      email: "invalidtokenuser@gmail.com",
      password: "invalidTokenPassword$123",
    };

    // Create a user with a valid verification token
    await userEntity.create(userData);

    // Attempt to verify the user with an invalid token
    const testee = supertest(app);
    const verifyResponse = await testee
      .get("/api/user/verify")
      .query({ token: "invalidToken", email: userData.email });

    expect(verifyResponse.status).toBe(400);
    expect(verifyResponse.body.success).toBe(false);
    expect(verifyResponse.body.message).toBe("Ungültiger Verifizierungstoken");

    // Check that the user's `isVerified` field is still false
    const unverifiedUser = await userEntity.findOne({
      where: { email: userData.email },
    });
    expect(unverifiedUser.isVerified).toBe(false);
  });
});
