import { Request, Response } from "express";
import { FormulariosService } from "../services/formularios.service";
import {
  IdDuplicadoError,
  PayloadInvalidoError,
  FormularioNaoEncontradoError,
} from "../errors/customErrors";

const service = new FormulariosService();

export class FormulariosController {
  async create(req: Request, res: Response) {
    const payload = req.body;

    const form = await service.createForm(payload);

    if (!form) {
      throw new PayloadInvalidoError("Erro ao criar formulário");
    }

    return res.status(201).json({
      id: form.id,
      schema_version: form.schemaVersion,
      mensagem: "Formulário criado com sucesso",
      criado_em: form.dataCriacao,
    });
  }

  async list(req: Request, res: Response) {
    const resultado = await service.listForms(req.query);

    return res.json({
      pagina_atual: resultado.pagina_atual,
      total_paginas: resultado.total_paginas,
      total_itens: resultado.total_itens,
      formularios: resultado.formularios,
    });
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const form = await service.getFormById(id);

    if (!form) {
      throw new FormularioNaoEncontradoError(id);
    }

    return res.json(form);
  }

  async softDelete(req: Request, res: Response) {
    const { id } = req.params;
    const usuario = "usuario_admin";

    const result = await service.softDeleteForm(id, usuario);

    return res.json(result);
  }

  async updateSchemaVersion(req: Request, res: Response) {
    const id = req.params.id;
    const result = await service.updateSchemaVersion(id, req.body);
    return res.json(result);
  }
}
