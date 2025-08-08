import request from 'supertest';
import app from '../../app';

describe('Server startup', () => {
  it('deve responder 404 para rota inexistente', async () => {
    const res = await request(app).get('/rota-inexistente');
    expect(res.status).toBe(404);
  });
});
