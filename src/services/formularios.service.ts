import { FormulariosRepository } from '../repository/formularios.repository';
import { FormularioSchema, FormularioInput } from '../dto/formulario.schema';
import {
  DependenciaCircularError,
  FiltroInvalidoError,
  FormularioNaoEncontradoError,
  FormularioProtegidoError,
  IdDuplicadoError,
  PayloadInvalidoError,
  SchemaVersionInvalidaError,
} from '../errors/customErrors';
import {
  SchemaVersionUpdateInput,
  SchemaVersionUpdateSchema,
} from '../dto/formularioVersion.schema';
import { CampoResponse, FormResponse } from '../types';
import { validarCampos } from '../utils/validarCampos';

export class FormulariosService {
  private repo: FormulariosRepository;

  constructor() {
    this.repo = new FormulariosRepository();
  }

  async createForm(payload: any) {
    const data: FormularioInput = FormularioSchema.parse(payload);

    const ids = data.campos.map((c) => c.id);
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      throw new IdDuplicadoError('campo', 'Já existe um campo com ID duplicado no payload.');
    }

    validarCampos(data.campos);

    const existingForms = await this.repo.findAll({ nome: data.nome });
    if (existingForms.total_itens > 0) {
      throw new IdDuplicadoError('nome', `Já existe um formulário com o nome '${data.nome}'`);
    }

    // 5. Persistência
    const form = await this.repo.create({
      nome: data.nome,
      descricao: data.descricao,
      campos: data.campos,
    });

    if (!form) {
      throw new PayloadInvalidoError('Não foi possível criar o formulário');
    }

    return form;
  }

  async listForms(query: any) {
    const pagina = query.pagina ? parseInt(query.pagina) : 1;
    const tamanho_pagina = query.tamanho_pagina
      ? Math.min(parseInt(query.tamanho_pagina), 100)
      : 20;

    const ordenar_por = query.ordenar_por ?? 'nome';
    if (ordenar_por !== 'nome' && ordenar_por !== 'criado_em') {
      throw new FiltroInvalidoError(
        'ordenar_por',
        "O campo 'ordenar_por' deve ser um dos valores permitidos: nome, criado_em.",
      );
    }

    const campoOrdenacao = ordenar_por === 'criado_em' ? 'dataCriacao' : 'nome';
    return this.repo.findAll({
      nome: query.nome,
      schema_version: query.schema_version ? parseInt(query.schema_version) : undefined,
      pagina,
      tamanho_pagina,
      ordenar_por: campoOrdenacao,
      ordem: query.ordem === 'asc' ? 'asc' : 'desc',
    });
  }

  async getFormById(id: string) {
    const form = await this.repo.findById(id);
    if (!form) return null;

    return {
      id: form.id,
      nome: form.nome,
      descricao: form.descricao,
      schema_version: form.schemaVersion,
      criado_em: form.dataCriacao.toISOString(),
      campos: form.campos.map(
        (c: {
          campoId: any;
          label: any;
          tipo: any;
          obrigatorio: any;
          propriedades: any;
        }): CampoResponse => ({
          id: c.campoId,
          label: c.label,
          tipo: c.tipo,
          obrigatorio: c.obrigatorio,
          propriedades: c.propriedades,
        }),
      ),
    } as FormResponse;
  }

  async softDeleteForm(id: string, usuario: string) {
    const result = await this.repo.softDelete(id, usuario);

    if (result.status === 'not_found') {
      throw new FormularioNaoEncontradoError(id);
    }

    if (result.status === 'protected') {
      throw new FormularioProtegidoError();
    }

    if (result.status === 'already_deleted') {
      return {
        mensagem: `Formulário '${id}' já estava inativo.`,
        status: 'soft_deleted',
      };
    }

    return {
      mensagem: `Formulário '${id}' marcado como removido com sucesso.`,
      status: 'soft_deleted',
    };
  }

  async updateSchemaVersion(id: string, payload: any) {
    const data: SchemaVersionUpdateInput = SchemaVersionUpdateSchema.parse(payload);

    const ids = data.campos.map((c) => c.id);
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      throw new IdDuplicadoError('campo', 'IDs de campos duplicados não são permitidos.');
    }

    const form = await this.repo.findById(id);
    if (!form) {
      throw new FormularioNaoEncontradoError(id);
    }

    if (data.schema_version <= form.schemaVersion) {
      throw new SchemaVersionInvalidaError(
        `A versão ${data.schema_version} é inferior ou igual à versão atual (${form.schemaVersion}).`,
      );
    }

    const ciclos = detectCircularDependencies(data.campos);
    if (ciclos.length > 0) {
      throw new DependenciaCircularError(
        `Dependências circulares detectadas nos campos: ${ciclos.join(', ')}`,
      );
    }

    const updated = await this.repo.updateSchemaVersion(
      id,
      data.schema_version,
      form.nome,
      data.descricao,
      data.campos,
    );

    return {
      mensagem: 'Versão atualizada com sucesso.',
      id: updated.id,
      schema_version_anterior: form.schemaVersion,
      schema_version_nova: updated.schemaVersion,
      atualizado_em: new Date().toISOString(),
    };
  }
}

function detectCircularDependencies(
  campos: { id: string; tipo: string; dependencias?: string[] }[],
): string[] {
  const graph: Record<string, string[]> = {};
  campos.forEach((campo) => {
    if (campo.tipo === 'calculated' && campo.dependencias) {
      graph[campo.id] = campo.dependencias;
    } else {
      graph[campo.id] = [];
    }
  });

  const visited: Record<string, boolean> = {};
  const stack: Record<string, boolean> = {};
  const cycles: string[] = [];

  function dfs(node: string) {
    if (stack[node]) {
      cycles.push(node);
      return;
    }
    if (visited[node]) return;

    visited[node] = true;
    stack[node] = true;
    for (const dep of graph[node] || []) {
      dfs(dep);
    }
    stack[node] = false;
  }

  Object.keys(graph).forEach((node) => dfs(node));
  return cycles;
}
