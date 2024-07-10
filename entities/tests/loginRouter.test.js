const request = require('supertest');
const express = require('express');
const loginRouter = require('../../routes/loginRouter');
const userEntity = require("../userEntity");
const { Sequelize } = require("sequelize");
const sequelize = require("../../db/database"); // assuming you have a sequelize instance exported from your db-connection
const supertest = require('supertest');
const app = require("../../src/app");

describe('Login Router Tests', () => {
    beforeAll(async () => {
        await userEntity.sync({ force: true });
    });

    it('should login successfully with valid credentials', async () => {
        // First, create a user
        const user = await userEntity.create({
            username: "testuser1",
            email: "test@userlogin.de",
            password: "Testpassword123!",
        });

        // Attempt to login with the correct credentials
        const loginData = {
            username: "testuser1",
            password: "Testpassword123!",
        };
        const testee = supertest(app);
        const response = await testee.post('/api/login').send(loginData);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.loginData.username).toBe(loginData.username);
    });

    it('should fail to login with incorrect password', async () => {
        // Attempt to login with an incorrect password
        const loginData = {
            username: "testuser1",
            password: "wrongpassword",
        };
        const testee = supertest(app);
        const response = await testee.post('/api/login').send(loginData);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Username oder Passwort ist falsch");
    });

    it('should fail to login with non-existing user', async () => {
        // Attempt to login with a non-existing user
        const loginData = {
            username: "nonexistinguser",
            password: "anyPassword123",
        };
        const testee = supertest(app);
        const response = await testee.post('/api/login').send(loginData);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Username oder Passwort ist falsch");
    });

    it('should give interner server error, login without username', async () => {
        // First, create a user
        const user = await userEntity.create({
            username: "testuser5",
            email: "test@5login.de",
            password: "TestPassWord123!",
        });

        // Attempt to login with the correct credentials
        const loginData = {
            password: "TestPassWord123!",
        };
        const testee = supertest(app);
        const response = await testee.post('/api/login').send(loginData);

        expect(response.status).toBe(500);
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe("Interner Serverfehler");
    });

    it('should athenticate with correct data and JWT', async () => {
        // Create a user and login to get a JWT token
        const myUser = await userEntity.create({
            username: "testuserauth",
            email: "test@useraut.de",
            password: "Tgisdljcehibni%%$t6%",
        });
        const loginData = {
            username: "testuserauth",
            password: "Tgisdljcehibni%%$t6%",
        };
        const testee = supertest(app);
        const loginResponse = await testee.post('/api/login').send(loginData);
        const jwtToken = loginResponse.body.loginData.token;

        // Authenticate with the JWT token
        const authResponse = await testee.get('/api/login/auth').query({userId: myUser.id, jwtToken});// Hier without userID
        expect(authResponse.status).toBe(200);
        expect(authResponse.body.message).toBe("Authentifizierung erfolgreich");
    });

    it('should fail to authenticate with no userId', async () => {
        // Create a user and login to get a JWT token
        const myUser = await userEntity.create({
            username: "testuser2auth",
            email: "test@userauthy.de",
            password: "TgisjuiPPas343452$$",
        });
        const loginData = {
            username: "testuser2auth",
            password: "TgisjuiPPas343452$$",
        };
        const testee = supertest(app);
        const loginResponse = await testee.post('/api/login').send(loginData);
        const jwtToken = loginResponse.body.loginData.jwtToken;

        // Authenticate with the JWT token
        const authResponse = await testee.get('/api/login/auth').query({jwtToken});// Hier without userID
        expect(authResponse.status).toBe(500);
        expect(authResponse.body.message).toBe("Interner Serverfehler");
    });

    it('should fail to authenticate', async () => {
        // Create a user and login to get a JWT token
        const myUser = await userEntity.create({
            username: "testuser3auth",
            email: "test@userauthy3.de",
            password: "TgisjuiPPdncdkj§5534$$",
        });
        const loginData = {
            username: "testuser3auth",
            password: "TgisjuiPPdncdkj§5534$$",
        };
        const testee = supertest(app);
        const loginResponse = await testee.post('/api/login').send(loginData);
        const jwtToken = loginResponse.body.loginData.jwtToken;

        // Authenticate with the JWT token
        const authResponse = await testee.get('/api/login/auth').query({userId: myUser.id, jwtToken});// Hier without userID
        expect(authResponse.status).toBe(401);
        expect(authResponse.body.message).toBe("Ungültiges Token oder Benutzer-ID");
    });

});
