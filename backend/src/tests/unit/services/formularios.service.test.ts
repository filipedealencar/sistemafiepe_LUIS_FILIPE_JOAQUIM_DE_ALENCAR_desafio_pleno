import { FormulariosService } from "../../../../src/services/formularios.service";
import { FormulariosRepository } from "../../../../src/repository/formularios.repository";
import { IdDuplicadoError } from "../../../../src/errors/customErrors";

jest.mock("../../../../src/repository/formularios.repository");
jest.mock("../../../config/prisma", () => ({
  prisma: {
    formulario: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    resposta: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe("FormulariosService", () => {
  let service: FormulariosService;
  let repoMock: jest.Mocked<FormulariosRepository>;

  beforeEach(() => {
    repoMock =
      new FormulariosRepository() as jest.Mocked<FormulariosRepository>;
    service = new FormulariosService();
    (service as any).repo = repoMock;
  });

  it("deve lançar erro se campos duplicados são enviados", async () => {
    const payload = {
      nome: "Formulário duplicado",
      descricao: "",
      campos: [
        { id: "nome", label: "Nome", tipo: "text", obrigatorio: true },
        {
          id: "nome",
          label: "Nome duplicado",
          tipo: "text",
          obrigatorio: true,
        },
      ],
    };

    await expect(service.createForm(payload)).rejects.toThrow(IdDuplicadoError);
  });

  it("deve criar formulário com sucesso", async () => {
    repoMock.findAll.mockResolvedValue({
      pagina_atual: 1,
      total_paginas: 1,
      total_itens: 0,
      formularios: [],
    });
    repoMock.create.mockResolvedValue({
      id: "123",
      schemaVersion: 1,
      dataCriacao: new Date(),
    } as any);

    const payload = {
      nome: "Formulário válido",
      descricao: "Teste",
      campos: [{ id: "nome", label: "Nome", tipo: "text", obrigatorio: true }],
    };

    const resultado = await service.createForm(payload);
    expect(resultado).toHaveProperty("id", "123");
  });

  it("deve lançar erro ao tentar criar formulário com nome duplicado", async () => {
    repoMock.findAll.mockResolvedValue({
      pagina_atual: 1,
      total_paginas: 1,
      total_itens: 1,
      formularios: [
        {
          id: "123",
          nome: "Form duplicado",
          schemaVersion: 1,
          dataCriacao: new Date(),
        },
      ],
    });

    await expect(
      service.createForm({
        nome: "Form duplicado",
        campos: [
          { id: "1", label: "Campo 1", tipo: "text", obrigatorio: true },
        ],
      })
    ).rejects.toThrow(IdDuplicadoError);
  });

  it("deve lançar erro de dependência circular", async () => {
    // Mockando o retorno do formulário existente
    repoMock.findById = jest.fn().mockResolvedValue({
      id: "formId",
      nome: "Formulário teste",
      descricao: "Teste",
      schemaVersion: 1,
      isAtivo: true,
      protegido: false,
      dataCriacao: new Date(),
      campos: [],
    } as any);

    const payload = {
      schema_version: 2,
      descricao: "Nova versão com dependência circular",
      campos: [
        {
          id: "a",
          label: "Campo A",
          tipo: "calculated",
          obrigatorio: true,
          propriedades: {},
          dependencias: ["b"],
        },
        {
          id: "b",
          label: "Campo B",
          tipo: "calculated",
          obrigatorio: true,
          propriedades: {},
          dependencias: ["a"],
        },
      ],
    };

    await expect(
      service.updateSchemaVersion("formId", payload)
    ).rejects.toThrow("Dependências circulares detectadas");
  });
});
