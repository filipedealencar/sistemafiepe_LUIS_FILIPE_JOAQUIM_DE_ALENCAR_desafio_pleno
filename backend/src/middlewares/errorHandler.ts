import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../errors/apiErrors";
import { InternalServerError } from "../errors/customErrors";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  // Verifica se é erro do Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      erro: "payload_invalido",
      mensagem: "Erro de validação",
      detalhes: err.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensagem: issue.message,
      })),
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
