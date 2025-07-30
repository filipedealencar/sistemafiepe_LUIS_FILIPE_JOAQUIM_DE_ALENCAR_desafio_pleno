import request from "supertest";
import app from "../../app";

describe("Formularios API", () => {
  let formId: string;

  it("deve criar um novo formulário", async () => {
    const res = await request(app)
      .post("/formularios")
      .send({
        nome: "Ficha de Teste",
        descricao: "Formulário de teste",
        campos: [
          {
            id: "nome_completo",
            label: "Nome Completo",
            tipo: "text",
            obrigatorio: true,
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.mensagem).toBe("Formulário criado com sucesso");

    formId = res.body.id;
  });

  it("deve listar formulários", async () => {
    const res = await request(app).get("/formularios");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.formularios)).toBe(true);
  });

  it("deve retornar detalhes de um formulário", async () => {
    const res = await request(app).get(`/formularios/${formId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", formId);
  });

  it("deve remover logicamente um formulário", async () => {
    const res = await request(app).delete(`/formularios/${formId}`);
    expect(res.status).toBe(200);
    expect(res.body.mensagem).toContain(
      `Formulário '${formId}' marcado como removido com sucesso.`
    );
  });
});
