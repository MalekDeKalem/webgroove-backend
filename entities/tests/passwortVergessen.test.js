// istanbul ignore file

const request = require("supertest");
const express = require("express");
const { sequelize, User } = require("../db-connection");
const router = require("../../routes/userVerwaltungRouter");
const userEntity = require("../userEntity");

const app = express();
app.use(express.json());
app.use("/users", router);

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test("POST /users - should create a new user", async () => {
  const newUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "password123",
    profilePicture: null,
    country: "Germany",
  };

  const response = await request(app).post("/users").send(newUser).expect(201);

  expect(response.body).toHaveProperty("id");
  expect(response.body.username).toBe(newUser.username);
  expect(response.body.email).toBe(newUser.email);
});

test("GET /users - should retrieve all users", async () => {
  const response = await request(app).get("/users").expect(200);

  expect(Array.isArray(response.body)).toBe(true);
});

test("GET /users/:id - should retrieve a user by id", async () => {
  const user = await userEntity.create({
    username: "testuser2",
    email: "testuser2@example.com",
    password: "password123",
    profilePicture: null,
    country: "Germany",
  });

  const response = await request(app).get(`/users/${user.id}`).expect(200);

  expect(response.body).toHaveProperty("id", user.id);
  expect(response.body.username).toBe(user.username);
  expect(response.body.email).toBe(user.email);
});

test("PUT /users/:id - should update a user by id", async () => {
  const user = await userEntity.create({
    username: "testuser3",
    email: "testuser3@example.com",
    password: "password123",
    profilePicture: null,
    country: "Germany",
  });

  const updatedData = {
    username: "updateduser",
    email: "updateduser@example.com",
    password: "newpassword123",
  };

  const response = await request(app)
    .put(`/users/${user.id}`)
    .send(updatedData)
    .expect(200);

  expect(response.body.username).toBe(updatedData.username);
  expect(response.body.email).toBe(updatedData.email);
});

test("DELETE /users/:id - should delete a user by id", async () => {
  const user = await userEntity.create({
    username: "testuser4",
    email: "testuser4@example.com",
    password: "password123",
    profilePicture: null,
    country: "Germany",
  });

  await request(app).delete(`/users/${user.id}`).expect(204);

  const deletedUser = await userEntity.findByPk(user.id);
  expect(deletedUser).toBeNull();
});
