const { sequelize } = require("../../entities/db-connection");
const userEntity = require("../../entities/userEntity");
const { userService } = require("../../services/userService");
const bcrypt = require("bcrypt");

jest.mock("bcrypt");
jest.mock("../../entities/userEntity");

const service = new userService();

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

afterEach(() => {
  jest.clearAllMocks();
});

test("should create a user", async () => {
  const mockUser = {
    id: 1,
    username: "testuser",
    email: "testuser@example.com",
    profilePicture: null,
    password: "hashedpassword",
  };

  userEntity.create.mockResolvedValue(mockUser);

  const user = await service.createUser(
    "testuser",
    "testuser@example.com",
    null,
    "testpassword"
  );

  expect(user).toBeDefined();
  expect(user.username).toBe("testuser");
  expect(user.email).toBe("testuser@example.com");
  expect(userEntity.create).toHaveBeenCalledWith({
    username: "testuser",
    email: "testuser@example.com",
    profilePicture: null,
    password: "testpassword",
  });
});

test("should authenticate a user with correct credentials", async () => {
  const mockUser = {
    id: 1,
    email: "testuser@example.com",
    password: "hashedpassword",
  };

  userEntity.findOne.mockResolvedValue(mockUser);
  bcrypt.compare.mockResolvedValue(true);

  const user = await service.authenticateUser(
    "testuser@example.com",
    "testpassword"
  );

  expect(user).toBeDefined();
  expect(user.email).toBe("testuser@example.com");
  expect(userEntity.findOne).toHaveBeenCalledWith({
    where: { email: "testuser@example.com" },
  });
  expect(bcrypt.compare).toHaveBeenCalledWith("testpassword", "hashedpassword");
});

test("should not authenticate a user with incorrect credentials", async () => {
  const mockUser = {
    id: 1,
    email: "testuser@example.com",
    password: "hashedpassword",
  };

  userEntity.findOne.mockResolvedValue(mockUser);
  bcrypt.compare.mockResolvedValue(false);

  await expect(
    service.authenticateUser("testuser@example.com", "wrongpassword")
  ).rejects.toThrow("Invalid password");

  expect(userEntity.findOne).toHaveBeenCalledWith({
    where: { email: "testuser@example.com" },
  });
  expect(bcrypt.compare).toHaveBeenCalledWith(
    "wrongpassword",
    "hashedpassword"
  );
});

test("should get a user by ID", async () => {
  const mockUser = {
    id: 1,
    email: "testuser@example.com",
  };

  userEntity.findByPk.mockResolvedValue(mockUser);

  const user = await service.getUserById(mockUser.id);
  expect(user).toBeDefined();
  expect(user.email).toBe("testuser@example.com");
  expect(userEntity.findByPk).toHaveBeenCalledWith(mockUser.id);
});

test("should update a user", async () => {
  const mockUser = {
    id: 1,
    username: "testuser",
    email: "testuser@example.com",
    update: jest.fn().mockResolvedValue(true),
  };

  userEntity.findByPk.mockResolvedValue(mockUser);

  const updatedUser = await service.updateUser(mockUser.id, {
    username: "updateduser",
  });

  expect(updatedUser.username).toBe("testuser");
  expect(mockUser.update).toHaveBeenCalledWith({ username: "updateduser" });
  expect(userEntity.findByPk).toHaveBeenCalledWith(mockUser.id);
});

test("should delete a user", async () => {
  const mockUser = {
    id: 1,
    email: "testuser@example.com",
    destroy: jest.fn().mockResolvedValue(true),
  };

  userEntity.findByPk.mockResolvedValue(mockUser);

  await service.deleteUser(mockUser.id);

  expect(mockUser.destroy).toHaveBeenCalled();
  expect(userEntity.findByPk).toHaveBeenCalledWith(mockUser.id);
});

test("should get all users", async () => {
  const mockUsers = [
    { id: 1, email: "testuser1@example.com" },
    { id: 2, email: "testuser2@example.com" },
  ];

  userEntity.findAll.mockResolvedValue(mockUsers);

  const users = await service.getAllUsers();
  expect(users.length).toBeGreaterThan(0);
  expect(users).toEqual(mockUsers);
  expect(userEntity.findAll).toHaveBeenCalled();
});

test("should compare JWT", async () => {
  const mockUser = {
    id: 1,
    email: "testuser1@example.com",
    jwt: "sometoken",
  };

  userEntity.findByPk.mockResolvedValue(mockUser);

  const result = await service.compareJWT(mockUser.id, "sometoken");
  expect(result.success).toBe(true);

  const invalidResult = await service.compareJWT(mockUser.id, "invalidtoken");
  expect(invalidResult.success).toBe(false);

  expect(userEntity.findByPk).toHaveBeenCalledWith(mockUser.id);
});
