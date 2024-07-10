const { Sequelize } = require("sequelize");
const userEntity = require("../userEntity");
const sequelize = require("../../db/database");
const bcrypt = require("bcrypt");
const { userService } = require("../../services/userService");

describe("User Tests", () => {
  beforeAll(async () => {
    await userEntity.sync({ force: true });
  });

  it("should create a new user", async () => {
    const user = await userEntity.create({
      username: "person",
      email: "test@fa.de",
      password: "123456",
    });
    expect(user).toBeTruthy();
    expect(user.username).toBe("person");
    expect(user.email).toBe("test@fa.de");
  });

  it("should find all users", async () => {
    const userSrv = new userService
    const user = await userEntity.create({
      username: "person2",
      email: "test2@fa.de",
      password: "123456feESF",
    });

    const users = await userSrv.getAllUsers();
    expect(users.length).toBeGreaterThan(0);
  });

  it("should create multiple users", async () => {
    const usersData = [
      {
        username: "person1",
        email: "person1@222ddera2.de",
        password: "123456",
      },
      {
        username: "person2",
        email: "person2@22qd2ary2.de",
        password: "123456",
      },
      {
        username: "person3",
        email: "person3@222cydfq2.de",
        password: "123456",
      },
    ];

    const createdUsers = await Promise.all(
      usersData.map((data) => userEntity.create(data))
    );

    expect(createdUsers).toHaveLength(usersData.length);
    createdUsers.forEach((user, index) => {
      expect(user.username).toBe(usersData[index].username);
      expect(user.email).toBe(usersData[index].email);
    });
  });
});

describe("User Tests", () => {
  beforeAll(async () => {
    await userEntity.sync({ force: true });
  });

  it("should create a new user with hashed password", async () => {
    const user = await userEntity.create({
      username: "person",
      email: "test@faaefyd13r.de",
      password: "123456",
    });
    expect(user).toBeTruthy();
    expect(user.username).toBe("person");
    expect(user.email).toBe("test@faaefyd13r.de");
    expect(user.password).not.toBe("123456");

    const isPasswordValid = await bcrypt.compare("123456", user.password);
    expect(isPasswordValid).toBe(true);
  });
});
