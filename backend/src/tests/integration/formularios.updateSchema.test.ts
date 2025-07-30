import request from "supertest";
import app from "../../../src/app";

describe("PUT /formularios/:id/schema_version", () => {
  let formId: string;

  beforeAll(async () => {
    const uniqueName = `Form com Versionamento ${Date.now()}`;
    const res = await request(app)
      .post("/formularios")
      .send({
        schema_version: 1,
        nome: uniqueName,
        campos: [
          { id: "idade", label: "Idade", tipo: "number", obrigatorio: true },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    formId = res.body.id;
  });

  it("deve criar uma nova versão do schema", async () => {
    const payload = {
      schema_version: 2,
      nome: "Form atualizado",
      campos: [
        { id: "idade", label: "Idade", tipo: "number", obrigatorio: true },
        {
          id: "idade_maior",
          label: "É maior de idade?",
          tipo: "calculated",
          formula: "idade >= 18",
          dependencias: ["idade"],
        },
      ],
    };

    const res = await request(app)
      .put(`/formularios/${formId}/schema_version`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.mensagem).toContain("Versão atualizada com sucesso");
    expect(res.body.schema_version_nova).toBe(2);
  });

  it("deve falhar se schema_version é inferior à atual", async () => {
    const payload = {
      schema_version: 1,
      campos: [{ id: "idade", label: "Idade", tipo: "number" }],
    };

    const res = await request(app)
      .put(`/formularios/${formId}/schema_version`)
      .send(payload);

    expect(res.status).toBe(422);
    expect(res.body.erro).toBe("schema_version_invalida");
  });

  it("deve detectar dependência circular entre campos calculados", async () => {
    const payload = {
      schema_version: 3,
      campos: [
        {
          id: "a",
          label: "Campo A",
          tipo: "calculated",
          formula: "b + 1",
          dependencias: ["b"],
        },
        {
          id: "b",
          label: "Campo B",
          tipo: "calculated",
          formula: "a + 1",
          dependencias: ["a"],
        },
      ],
    };

    const res = await request(app)
      .put(`/formularios/${formId}/schema_version`)
      .send(payload);

    expect(res.status).toBe(500);
    expect(res.body.mensagem.toLowerCase()).toContain(
      "dependências circulares"
    );
  });
});
