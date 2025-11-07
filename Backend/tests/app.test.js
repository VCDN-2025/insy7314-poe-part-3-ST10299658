const request = require('supertest');
const app = require('../app'); // your Express app

describe('Basic API tests', () => {
  it('GET / should return API running', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Bank Portal API');
  });

  it('GET /api/health should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
