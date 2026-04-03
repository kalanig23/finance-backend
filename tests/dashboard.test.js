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
app.use('/api/dashboard', require('../routes/dashboard'));

let adminToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@gmail.com', password: 'admin123' });
  adminToken = res.body.token;

}, 30000);

afterAll(async () => {
  await mongoose.connection.close();
}, 30000);

describe('Dashboard Routes', () => {

  test('Summary dekh sake', async () => {
    const res = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalIncome');
    expect(res.body).toHaveProperty('totalExpense');
    expect(res.body).toHaveProperty('netBalance');
  }, 30000);

  test('Monthly trends dekh sake', async () => {
    const res = await request(app)
      .get('/api/dashboard/monthly')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('trends');
  }, 30000);

  test('Category totals dekh sake', async () => {
    const res = await request(app)
      .get('/api/dashboard/categories')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('categories');
  }, 30000);

  test('Bina token ke dashboard na dikhe', async () => {
    const res = await request(app)
      .get('/api/dashboard/summary');

    expect(res.statusCode).toBe(401);
  }, 30000);

});