const {
  //sendRegistrationConfirmationEmail,
  sendPasswordResetEmail,
  generateToken,
  verifyToken,
  hashPassword,
  findUserByEmail,
  findUserById,
} = require("../emailService");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sequelize } = require("../../entities/db-connection");

jest.mock("nodemailer");

describe("Email Service Tests", () => {
  let testUser;
  let sendMailMock;

  beforeAll(async () => {
    testUser = {
      id: 1,
      email: "test@example.com",
      password: "password",
    };

    sendMailMock = jest.fn().mockImplementation((mailOptions, callback) => {
      callback(null, { messageId: "123" });
    });

    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //   it("should send registration confirmation email", async () => {
  //     const confirmationLink = "http://example.com/confirm";
  //     await sendRegistrationConfirmationEmail(testUser.email, confirmationLink);
  //     expect(sendMailMock).toHaveBeenCalledTimes(1);
  //     expect(sendMailMock).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         to: testUser.email,
  //         subject: "Registration Confirmation",
  //       }),
  //       expect.any(Function)
  //     );
  //   });

  //   it("should handle error when sending registration confirmation email", async () => {
  //     sendMailMock.mockImplementationOnce((mailOptions, callback) => {
  //       callback(new Error("Failed to send email"), null);
  //     });

  //     const confirmationLink = "http://example.com/confirm";
  //     await expect(
  //       sendRegistrationConfirmationEmail(testUser.email, confirmationLink)
  //     ).rejects.toThrow("Failed to send email");
  //   });

  //   it("should send password reset email", async () => {
  //     const resetLink = "http://example.com/reset-password";
  //     await sendPasswordResetEmail(testUser.email, resetLink);
  //     expect(sendMailMock).toHaveBeenCalledTimes(1);
  //     expect(sendMailMock).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         to: testUser.email,
  //         subject: "Password Reset",
  //       }),
  //       expect.any(Function)
  //     );
  //   });

  //   it("should handle error when sending password reset email", async () => {
  //     sendMailMock.mockImplementationOnce((mailOptions, callback) => {
  //       callback(new Error("Failed to send email"), null);
  //     });

  //     const resetLink = "http://example.com/reset-password";
  //     await expect(
  //       sendPasswordResetEmail(testUser.email, resetLink)
  //     ).rejects.toThrow("Failed to send email");
  //   });

  it("should generate a valid token", () => {
    const token = generateToken({ id: testUser.id });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(testUser.id);
  });

  it("should verify a valid token", async () => {
    const token = generateToken({ id: testUser.id });
    const decoded = await verifyToken(token);
    expect(decoded.id).toBe(testUser.id);
  });

  it("should handle invalid token verification", async () => {
    const invalidToken = "invalid.token.here";
    await expect(verifyToken(invalidToken)).rejects.toThrow();
  });

  it("should hash a password correctly", async () => {
    const password = "password123";
    const hashedPassword = await hashPassword(password);
    const match = await bcrypt.compare(password, hashedPassword);
    expect(match).toBe(true);
  });

  //   it("should find user by email", () => {
  //     const user = findUserByEmail(testUser.email);
  //     expect(user).toEqual(expect.objectContaining({ email: testUser.email }));
  //   });

  it("should return undefined if user by email is not found", () => {
    const user = findUserByEmail("nonexistent@example.com");
    expect(user).toBeUndefined();
  });

  it("should find user by id", () => {
    const user = findUserById(testUser.id);
    expect(user).toEqual(expect.objectContaining({ id: testUser.id }));
  });

  it("should return undefined if user by id is not found", () => {
    const user = findUserById(999);
    expect(user).toBeUndefined();
  });

  afterAll(() => {
    sequelize.close();
  });
});
