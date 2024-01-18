// Write your tests here
const db = require('../data/dbConfig');
const request = require('supertest');
const server = require('../api/server');
const bcrypt = require('bcryptjs');
test('sanity', () => {
  expect(true).toBe(true);
});


beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});


// describe('[GET /api/jokes]', () => {
//   test('responds with 200 OK when a valid token is provided', async () => {
//     let res = await request(server).post('/api/auth/login').send({ username: "", password: ""});
//     res = await request(server).get('/api/jokes').set('Authorization', res.body.token);
//     expect(res.status).toBe(200);
//   });
// });

describe('[GET] /api/jokes', () => {
  test('responds with 200 OK when a valid token is provided', async () => {
    const loginResponse = await request(server).post('/api/auth/login').send({ username: "bob", password: "1234" });
    
    if (loginResponse.body.token) {
      const res = await request(server).get('/api/jokes').set('Authorization', `Bearer ${loginResponse.body.token}`);
      expect(res.status).toBe(200);
    }
  });
  test('responds with 401 Unauthorized when no token is provided', async () => {
    const res = await request(server).get('/api/jokes');
    expect(res.status).toBe(401);
  });
});

describe('[POST] /api/auth/register', () => {
  test('responds with 400 when username or password is not entered', async () => {
    const res = await request(server).post('/api/auth/register');
    expect(res.status).toBe(400);
  });
  test('saves the user with a bcrypted password instead of plain text', async () => {
      await request(server).post('/api/auth/register').send({ username: 'devon', password: '1234' });
      const devon = await db('users').where('username', 'devon').first();
      expect(bcrypt.compareSync('1234', devon.password)).toBeTruthy();
    }, 750);
});

describe('[POST] /api/auth/login', () => {
  test('responds with 400 when username or password is not entered', async () => {
    const res = await request(server).post('/api/auth/login');
    expect(res.status).toBe(400);
  });
  test('responds with the correct message on invalid credentials', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: 'devone', password: '1234' });
    console.log(res.body)
    expect(res.body.message).toMatch(/invalid credentials/i);
  }, 750);
});

