import { prisma } from '../../config';
import { RespostasRepository } from '../../repository/respostas.repository';

jest.mock('../../config/prisma', () => ({
  prisma: {
    resposta: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('RespostasRepository', () => {
  let repository: RespostasRepository;

  beforeEach(() => {
    repository = new RespostasRepository();
    jest.clearAllMocks();
  });

  it('deve criar uma resposta', async () => {
    (prisma.resposta.create as jest.Mock).mockResolvedValue({ id: '123' });

    const result = await repository.createResposta('form1', 1, {
      nome: 'teste',
    });

    expect(prisma.resposta.create).toHaveBeenCalledWith({
      data: {
        formularioId: 'form1',
        schemaVersion: 1,
        respostas: { nome: 'teste' },
        isAtivo: true,
      },
    });
    expect(result).toEqual({ id: '123' });
  });

  it('deve buscar respostas com paginação', async () => {
    const query = { pagina: 2, tamanho_pagina: 10 };
    (prisma.resposta.findMany as jest.Mock).mockResolvedValue([{ id: '1' }]);
    (prisma.resposta.count as jest.Mock).mockResolvedValue(15);

    const result = await repository.findRespostas('form1', query);

    expect(prisma.resposta.findMany).toHaveBeenCalledWith({
      where: { formularioId: 'form1', isAtivo: true },
      skip: 10,
      take: 10,
      orderBy: { criadoEm: 'desc' },
    });
    expect(result).toEqual({
      pagina: 2,
      tamanho_pagina: 10,
      total: 15,
      resultados: [{ id: '1' }],
    });
  });

  it('deve deletar resposta logicamente', async () => {
    (prisma.resposta.findFirst as jest.Mock).mockResolvedValue({ id: '123' });
    (prisma.resposta.update as jest.Mock).mockResolvedValue({ id: '123' });

    const result = await repository.softDeleteResposta('form1', '123', 'usuario1');

    expect(prisma.resposta.findFirst).toHaveBeenCalledWith({
      where: { id: '123', formularioId: 'form1', isAtivo: true },
    });
    expect(prisma.resposta.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: expect.objectContaining({
        isAtivo: false,
        usuarioRemocao: 'usuario1',
      }),
    });
    expect(result).toEqual({ id: '123' });
  });

  it('deve retornar null se resposta não existe ao deletar', async () => {
    (prisma.resposta.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await repository.softDeleteResposta('form1', 'nao-existe', 'usuario1');

    expect(result).toBeNull();
    expect(prisma.resposta.update).not.toHaveBeenCalled();
  });
});
