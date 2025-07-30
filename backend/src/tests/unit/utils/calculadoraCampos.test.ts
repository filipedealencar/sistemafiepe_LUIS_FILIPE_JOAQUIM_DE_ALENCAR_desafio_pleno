import { calcularCampos } from "../../../utils/calculadoraCampos";

describe("calcularCampos", () => {
  it("deve calcular campos derived corretamente", () => {
    const form = {
      campos: [
        {
          campoId: "idade",
          tipo: "calculated",
          formula: "2025 - ano_nascimento",
        },
      ],
    };
    const respostas = { ano_nascimento: 2000 };

    const resultado = calcularCampos(form, respostas);

    expect(resultado).toHaveProperty("idade", 25);
  });

  it("deve retornar null para fórmulas inválidas", () => {
    const form = {
      campos: [
        { campoId: "teste", tipo: "calculated", formula: "ano_nascimento / 0" },
      ],
    };
    const respostas = { ano_nascimento: 2000 };

    const resultado = calcularCampos(form, respostas);

    expect(resultado.teste).toBeNull();
  });
});
