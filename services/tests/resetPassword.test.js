// istanbul ignore file

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const {
  sendPasswordResetEmail,
  generateToken,
  findUserByEmail,
} = require("../emailService");

jest.mock("nodemailer");
jest.mock("jsonwebtoken");
jest.mock("../emailService", () => {
  const originalModule = jest.requireActual("../emailService");

  return {
    ...originalModule,
    sendEmail: jest.fn(),
    findUserByEmail: jest.fn().mockImplementation(async (email) => ({
      id: 1,
      username: "testuser",
      email,
    })),
  };
});

describe("sendPasswordResetEmail", () => {
  let sendEmailMock;

  beforeAll(() => {
    sendEmailMock = require("../emailService").sendEmail;
    sendEmailMock.mockResolvedValue({ messageId: "test-message-id" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send a password reset email", async () => {
    const email = "user@example.com";
    const user = await findUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const token = "test-token";
    jwt.sign.mockReturnValue(token);

    await sendPasswordResetEmail(email, token, user);
  });
});
