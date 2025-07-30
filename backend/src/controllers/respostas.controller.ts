import { Request, Response } from "express";
import { RespostasService } from "../services/respostas.service";
import { RespostasQuerySchema } from "../dto/respostas.query.schema";

const service = new RespostasService();

export class RespostasController {
  async criar(req: Request, res: Response) {
    const { id } = req.params;
    const resultado = await service.criarResposta(id, req.body);
    return res.status(201).json(resultado);
  }

  async listar(req: Request, res: Response) {
    const { id } = req.params;

    const query = RespostasQuerySchema.parse(req.query);

    const resultado = await service.listarRespostas(id, query);
    return res.json(resultado);
  }

  async remover(req: Request, res: Response) {
    const { id, id_resposta } = req.params;
    const usuario = "usuario_admin";
    const resultado = await service.removerResposta(id, id_resposta, usuario);
    return res.json(resultado);
  }
}
