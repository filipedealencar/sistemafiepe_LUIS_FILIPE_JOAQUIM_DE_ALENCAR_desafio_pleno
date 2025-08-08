const mockCriarResposta = jest.fn();

jest.mock('../../services/respostas.service', () => {
  return {
    RespostasService: jest.fn().mockImplementation(() => ({
      criarResposta: mockCriarResposta,
    })),
  };
});

import { Request, Response, NextFunction } from 'express';
import { RespostasController } from '../../controllers/respostas.controller';

const controller = new RespostasController();

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('RespostasController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: { id: '123' }, // <-- aqui
      body: { respostas: { campo1: 'valor' } },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    mockCriarResposta.mockReset();
  });

  it('deve criar uma resposta com sucesso', async () => {
    const respostaCriada = { id: '1', ...req.body };
    mockCriarResposta.mockResolvedValue(respostaCriada);

    await controller.criar(req as Request, res as Response, next);

    expect(mockCriarResposta).toHaveBeenCalledWith('123', req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(respostaCriada);
  });

  it('deve chamar next com erro quando criarResposta lança exceção', async () => {
    const erro = new Error('Erro de teste');
    mockCriarResposta.mockRejectedValue(erro);

    await controller.criar(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(erro);
  });
});
