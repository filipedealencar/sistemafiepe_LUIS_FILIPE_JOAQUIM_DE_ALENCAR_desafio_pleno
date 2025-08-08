import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../errors/apiErrors';
import { InternalServerError } from '../errors/customErrors';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  // Verifica se é erro do Zod
  if (err instanceof ZodError) {
    const detalhes = err.issues.map((issue: any) => ({
      campo: issue?.path.join('.'),
      mensagem: issue?.message,
      campoId: issue?.params?.campoId,
    }));

    const regraInvalida = detalhes.find((d) => d.campo.includes('validacoes'));

    if (regraInvalida) {
      return res.status(422).json({
        erro: 'regra_invalida',
        campo: regraInvalida.campoId ?? regraInvalida.campo,
        mensagem: regraInvalida.mensagem,
      });
    }
    const isFiltroErro = detalhes.some((d) =>
      ['ordenar_por', 'ordem', 'pagina', 'tamanho_pagina', 'schema_version'].includes(d.campo),
    );

    if (isFiltroErro) {
      return res.status(422).json({
        erro: 'filtro_invalido',
        mensagem: detalhes[0].mensagem,
        campo: detalhes[0].campo,
      });
    }

    return res.status(400).json({
      erro: 'payload_invalido',
      mensagem: 'Erro de validação',
      detalhes,
    });
  }

  // Verifica se é um erro customizado
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      erro: err.erro,
      ...(err.campo ? { campo: err.campo } : {}),
      mensagem: err.message,
    });
  }

  // (qualquer outro erro)
  const internal = new InternalServerError();
  return res.status(internal.statusCode).json({
    erro: internal.erro,
    mensagem: internal.message,
  });
}
