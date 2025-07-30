import { prisma } from "../config/prisma";
import { FormularioInput } from "../dto/formulario.schema";

export class FormulariosRepository {
  async create(data: FormularioInput) {
    return await prisma.formulario.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        campos: {
          create: data.campos.map((c) => ({
            campoId: c.id,
            label: c.label,
            tipo: c.tipo,
            obrigatorio: c.obrigatorio ?? false,
            propriedades: c.propriedades ?? {},
          })),
        },
      },
      include: { campos: true },
    });
  }

  async findAll(params: {
    nome?: string;
    schema_version?: number;
    pagina?: number;
    tamanho_pagina?: number;
    ordenar_por?: "nome" | "dataCriacao";
    ordem?: "asc" | "desc";
  }) {
    const {
      nome,
      schema_version,
      pagina = 1,
      tamanho_pagina = 20,
      ordenar_por = "dataCriacao",
      ordem = "desc",
    } = params;

    const skip = (pagina - 1) * tamanho_pagina;

    const where: any = { isAtivo: true };
    if (nome) where.nome = { contains: nome, mode: "insensitive" };
    if (schema_version) where.schemaVersion = schema_version;

    const total = await prisma.formulario.count({ where });

    const formularios = await prisma.formulario.findMany({
      where,
      skip,
      take: Math.min(tamanho_pagina, 100),
      orderBy: { [ordenar_por]: ordem },
      select: { id: true, nome: true, schemaVersion: true, dataCriacao: true },
    });

    return {
      pagina_atual: pagina,
      total_paginas: Math.ceil(total / tamanho_pagina),
      total_itens: total,
      formularios,
    };
  }

  async findById(id: string) {
    return await prisma.formulario.findFirst({
      where: { id, isAtivo: true },
      include: { campos: true },
    });
  }

  async softDelete(id: string, usuario: string) {
    // Busca formulário primeiro
    const form = await prisma.formulario.findUnique({ where: { id } });

    if (!form || !form.isAtivo) {
      return { status: "not_found" };
    }

    if (form.protegido) {
      return { status: "protected" };
    }

    await prisma.formulario.update({
      where: { id },
      data: {
        isAtivo: false,
        dataRemocao: new Date(),
        usuarioRemocao: usuario,
      },
    });

    return { status: "deleted" };
  }

  async updateSchemaVersion(
    id: string,
    schema_version: number,
    nome: string,
    descricao: string | undefined,
    campos: any[]
  ) {
    return prisma.formulario.update({
      where: { id, isAtivo: true },
      data: {
        schemaVersion: schema_version,
        nome,
        descricao,
        campos: {
          deleteMany: {},
          create: campos.map((c) => ({
            campoId: c.id,
            label: c.label,
            tipo: c.tipo,
            obrigatorio: c.obrigatorio ?? false,
            propriedades: c.propriedades ?? {},
          })),
        },
      },
      include: { campos: true },
    });
  }
}
