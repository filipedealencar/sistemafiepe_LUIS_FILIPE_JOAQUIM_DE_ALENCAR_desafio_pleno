import request from 'supertest';
import app from '../../app';

describe('RespostasController - erros', () => {
  it('deve retornar erro 400 quando payload é inválido', async () => {
    const res = await request(app).post('/api/v1/formularios/id-falso/respostas').send({});
    expect(res.status).toBe(400);
  });
});
