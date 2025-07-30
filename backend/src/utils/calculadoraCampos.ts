import { Parser } from "expr-eval";

export function calcularCampos(form: any, respostasBase: any) {
  const parser = new Parser();
  const resultados: Record<string, any> = {};
  const contexto = { ...respostasBase };

  const camposCalculados = form.campos.filter(
    (c: any) => c.tipo === "calculated"
  );

  for (const campo of camposCalculados) {
    if (!campo.formula) continue;

    try {
      const expr = parser.parse(campo.formula);
      const valor = expr.evaluate(contexto);

      // 🔹 Garantir que valores inválidos virem null
      if (typeof valor !== "number" || !isFinite(valor)) {
        resultados[campo.campoId] = null;
      } else {
        resultados[campo.campoId] = valor;
        contexto[campo.campoId] = valor;
      }
    } catch {
      resultados[campo.campoId] = null;
    }
  }

  return resultados;
}
