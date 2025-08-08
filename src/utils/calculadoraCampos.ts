import { Parser } from 'expr-eval';

export function calcularCampos(form: any, respostasBase: any) {
  const parser = new Parser();

  // Adiciona a função today manualmente
  parser.functions.today = () => new Date().getTime() / (1000 * 60 * 60 * 24);

  const resultados: Record<string, any> = {};
  const contexto = { ...respostasBase };

  const camposCalculados = form.campos.filter((c: any) => c.tipo === 'calculated');

  for (const campo of camposCalculados) {
    if (!campo.formula) continue;

    try {
      const expr = parser.parse(campo.formula);
      const valor = expr.evaluate(contexto);

      if (typeof valor !== 'number' || !isFinite(valor)) {
        resultados[campo.id] = null;
      } else {
        const resultadoFinal =
          campo.precisao !== undefined && typeof campo.precisao === 'number'
            ? Number(valor.toFixed(campo.precisao))
            : valor;

        resultados[campo.id] = resultadoFinal;
        contexto[campo.id] = resultadoFinal;
      }
    } catch (e) {
      console.error(`Erro ao calcular campo ${campo.id}:`, e);
      resultados[campo.id] = null;
    }
  }

  return resultados;
}
