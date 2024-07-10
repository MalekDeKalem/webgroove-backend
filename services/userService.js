const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const emailService = require("./emailService");
const userEntity = require("../entities/userEntity");

class userService {
  constructor() {}

  async createUser(username, email, profilePicture, password) {
    try {
      const newUser = await userEntity.create({
        username,
        email,
        profilePicture,
        password,
      });
      return newUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async authenticateUser(email, password) {
    try {
      const user = await userEntity.findOne({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      return user;
    } catch (error) {
      throw new Error(`Error authenticating user: ${error.message}`);
    }
  }

  async compareJWT(userId, jwtToken) {
    try {
      const user = await userEntity.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if (user.jwt == jwtToken) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      throw new Error(`Error authenticating user: ${error.message}`);
    }
  }

  async getUserById(userId) {
    try {
      const user = await userEntity.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Error getting user by ID: ${error.message}`);
    }
  }

  async updateUser(userId, newData) {
    try {
      const user = await userEntity.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }
      await user.update(newData);
      return user;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async deleteUser(userId) {
    try {
      const user = await userEntity.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }
      await user.destroy();
      return user;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      const users = await userEntity.findAll();
      if (!users) {
        throw new Error("Users not found");
      }
      return users;
    } catch (error) {
      throw new Error(`Error retrieving user: ${error.message}`);
    }
  }
}

module.exports = { userService };
