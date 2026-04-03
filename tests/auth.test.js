const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/auth', require('../routes/auth'));

// Database connect karo test ke liye
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
}, 30000);

// Database disconnect karo test ke baad
afterAll(async () => {
  await mongoose.connection.close();
}, 30000);

// Tests
describe('Auth Routes', () => {

  test('User register ho jaye', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@gmail.com`,
        password: 'test123',
        role: 'viewer'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User ban gaya!');
  }, 30000);

  test('Bina email ke register na ho', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        password: 'test123'
      });

    expect(res.statusCode).toBe(400);
  }, 30000);

  test('Galat password se login na ho', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(400);
  }, 30000);

  test('Sahi credentials se login ho jaye', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: 'admin123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  }, 30000);

});