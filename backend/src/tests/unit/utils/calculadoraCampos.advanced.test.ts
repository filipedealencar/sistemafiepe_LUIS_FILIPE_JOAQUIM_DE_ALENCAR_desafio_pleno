import { calcularCampos } from "../../../../src/utils/calculadoraCampos";

describe("calcularCampos - cenários avançados", () => {
  it("deve calcular com múltiplas dependências", () => {
    const form = {
      campos: [
        {
          campoId: "soma",
          tipo: "calculated",
          formula: "a + b",
          dependencias: ["a", "b"],
        },
      ],
    };
    const respostas = { a: 5, b: 10 };

    const result = calcularCampos(form, respostas);
    expect(result.soma).toBe(15);
  });

  it("deve aplicar arredondamento usando floor", () => {
    const form = {
      campos: [
        {
          campoId: "idade",
          tipo: "calculated",
          formula: "floor((2025 - ano_nascimento))",
          dependencias: ["ano_nascimento"],
        },
      ],
    };
    const respostas = { ano_nascimento: 2000 };
    const result = calcularCampos(form, respostas);
    expect(result.idade).toBe(25);
  });

  it("deve retornar null se dependência está ausente", () => {
    const form = {
      campos: [
        {
          campoId: "resultado",
          tipo: "calculated",
          formula: "x + 1",
          dependencias: ["x"],
        },
      ],
    };
    const respostas = {};
    const result = calcularCampos(form, respostas);
    expect(result.resultado).toBeNull();
  });
});
