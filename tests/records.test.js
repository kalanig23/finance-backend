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
app.use('/api/records', require('../routes/records'));

let adminToken;
let viewerToken;
let recordId;

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

}, 30000);

afterAll(async () => {
  await mongoose.connection.close();
}, 30000);

describe('Records Routes', () => {

  test('Admin record bana sake', async () => {
    const res = await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        amount: 5000,
        type: 'income',
        category: 'salary',
        notes: 'Monthly salary'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.record).toHaveProperty('_id');
    recordId = res.body.record._id;
  }, 30000);

  test('Viewer record na bana sake', async () => {
    const res = await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({
        amount: 5000,
        type: 'income',
        category: 'salary'
      });

    expect(res.statusCode).toBe(403);
  }, 30000);

  test('Bina token ke record na bane', async () => {
    const res = await request(app)
      .post('/api/records')
      .send({
        amount: 5000,
        type: 'income',
        category: 'salary'
      });

    expect(res.statusCode).toBe(401);
  }, 30000);

  test('Sab records dekh sake', async () => {
    const res = await request(app)
      .get('/api/records')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('records');
    expect(res.body).toHaveProperty('total');
  }, 30000);

  test('Pagination kaam kare', async () => {
    const res = await request(app)
      .get('/api/records?page=1&limit=5')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalPages');
    expect(res.body).toHaveProperty('page');
  }, 30000);

  test('Galat amount se record na bane', async () => {
    const res = await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        amount: -100,
        type: 'income',
        category: 'salary'
      });

    expect(res.statusCode).toBe(400);
  }, 30000);

  test('Admin record delete kar sake', async () => {
    const res = await request(app)
      .delete(`/api/records/${recordId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Record delete ho gaya!');
  }, 30000);

  test('Delete ke baad record na dikhe', async () => {
    const res = await request(app)
      .get(`/api/records/${recordId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  }, 30000);

});