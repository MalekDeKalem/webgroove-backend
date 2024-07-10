const request = require('supertest');
const app = require("../app");
const { sequelize } = require('../../entities/db-connection');
const userEntity = require('../../entities/userEntity');


describe('User Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/user')
      .send({
        email: 'test@example.com',  
        username: 'testuser',
        password: 'Test#23fycsS'
      });
      console.log('Response:', res.body); 
    expect(res.statusCode).toEqual(201);
  });


  afterAll(() => {
    sequelize.close();
  });

  userEntity.sync({ force: true });

});
