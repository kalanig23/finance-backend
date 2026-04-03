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
app.use('/api/users', require('../routes/users'));

let adminToken;
let viewerToken;
let userId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@gmail.com', password: 'admin123' });
  adminToken = adminRes.body.token;

  const viewerRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'viewer@gmail.com', password: 'viewer123' });
  viewerToken = viewerRes.body.token;
  userId = viewerRes.body.user.id;

}, 30000);

afterAll(async () => {
  await mongoose.connection.close();
}, 30000);

describe('Users Routes', () => {

  test('Admin sab users dekh sake', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('users');
  }, 30000);

  test('Viewer users na dekh sake', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${viewerToken}`);

    expect(res.statusCode).toBe(403);
  }, 30000);

  test('Admin role update kar sake', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'analyst' });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.role).toBe('analyst');
  }, 30000);

  test('Admin status update kar sake', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'inactive' });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.status).toBe('inactive');
  }, 30000);

});