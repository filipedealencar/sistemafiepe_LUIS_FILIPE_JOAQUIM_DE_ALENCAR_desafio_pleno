import { Request, Response } from 'express';
import { errorHandler } from '../../middlewares/errorHandler';

describe('Middleware errorHandler', () => {
  it('deve retornar erro padronizado', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    const err = new Error('Erro de teste');
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ erro: 'erro_interno' }));
  });
});
