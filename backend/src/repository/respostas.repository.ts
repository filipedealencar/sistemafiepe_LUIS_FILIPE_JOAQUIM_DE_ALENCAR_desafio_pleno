import { prisma } from "../config/prisma";

export class RespostasRepository {
  async createResposta(
    formularioId: string,
    schemaVersion: number,
    respostas: any
  ) {
    return prisma.resposta.create({
      data: {
        formularioId,
        schemaVersion,
        respostas,
        isAtivo: true,
      },
    });
  }

  async findRespostas(formularioId: string, query: any) {
    const skip = (query.pagina - 1) * query.tamanho_pagina;
    const take = query.tamanho_pagina;

    const where: any = { formularioId, isAtivo: true };
    if (query.schema_version) {
      where.schemaVersion = query.schema_version;
    }

    const [respostas, total] = await Promise.all([
      prisma.resposta.findMany({
        where,
        skip,
        take,
        orderBy: { criadoEm: "desc" },
      }),
      prisma.resposta.count({ where }),
    ]);

    return {
      pagina: query.pagina,
      tamanho_pagina: query.tamanho_pagina,
      total,
      resultados: respostas,
    };
  }

  async softDeleteResposta(
    formularioId: string,
    respostaId: string,
    usuario: string
  ) {
    const resposta = await prisma.resposta.findFirst({
      where: { id: respostaId, formularioId, isAtivo: true },
    });

    if (!resposta) {
      return null;
    }

    await prisma.resposta.update({
      where: { id: respostaId },
      data: {
        isAtivo: false,
        dataRemocao: new Date(),
        usuarioRemocao: usuario,
      },
    });

    return resposta;
  }
}
