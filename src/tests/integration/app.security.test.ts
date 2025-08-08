import request from 'supertest';
import app from '../../app';

describe('Segurança do app', () => {
  it('deve permitir CORS por padrão', async () => {
    const res = await request(app).get('/api/v1').set('Origin', 'http://example.com');

    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  it('deve aplicar rate limiting após várias requisições', async () => {
    const maxRequests = 100;
    let lastResponse: request.Response;

    for (let i = 0; i < maxRequests + 1; i++) {
      lastResponse = await request(app).get('/api/v1');
    }

    expect(lastResponse!.status).toBe(429);
    expect(lastResponse!.body.erro).toBe('too_many_requests');
  });
});
