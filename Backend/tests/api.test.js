jest.setTimeout(20000); 
const request = require('supertest');
const app = require('../app');

let token; // Will hold a valid token for protected routes

beforeAll(async () => {
  // Clean up previous test user if needed (optional)
  // await someUserCleanupFunction('testuser@example.com');

  // Register a test user
  await request(app)
    .post('/api/auth/register')
    .send({ email: 'testuser@example.com', password: 'Test@123' })
    .catch(err => {
      // Ignore duplicate registration errors
      if (!err.response || err.response.status !== 400) throw err;
    });

  // Login to get a valid token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'testuser@example.com', password: 'Test@123' });

  token = loginRes.body.token; // ✅ Dynamic token for tests
});

describe('Auth API', () => {
  it('POST /api/auth/register should create a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'anotheruser@example.com', password: 'Test@123' });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe('anotheruser@example.com');
  });

  it('POST /api/auth/login should login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'Test@123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });
});

describe('Employee API', () => {
  it('GET /api/employees should return employees', async () => {
    const res = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.employees)).toBe(true);
    expect(res.body.employees.length).toBeGreaterThan(0);
  });
});

describe('Payment API', () => {
  it('POST /api/payments should create a payment', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 150 });

    expect(res.statusCode).toBe(201);
    expect(res.body.payment.amount).toBe(150);
  });

  it('GET /api/payments should fetch all payments', async () => {
    const res = await request(app)
      .get('/api/payments')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.payments)).toBe(true);
    expect(res.body.payments.length).toBeGreaterThan(0);
  });
});
