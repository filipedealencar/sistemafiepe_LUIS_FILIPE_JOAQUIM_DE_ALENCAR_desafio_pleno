import { Parser } from 'expr-eval';

export function avaliarCondicional(
  condicao: string,
  contexto: Record<string, any>,
  strict = false,
): boolean {
  const parser = new Parser();

  const coercedContext = Object.fromEntries(
    Object.entries(contexto).map(([k, v]) => {
      if (typeof v === 'string') {
        if (!isNaN(Number(v))) return [k, Number(v)];
        if (v.toLowerCase() === 'true') return [k, true];
        if (v.toLowerCase() === 'false') return [k, false];
      }
      return [k, v];
    }),
  );

  try {
    const expr = parser.parse(condicao);
    const resultado = expr.evaluate(coercedContext);

    return typeof resultado === 'boolean' ? resultado : Boolean(resultado);
  } catch (e) {
    if (strict) throw new Error(`Expressão condicional inválida: ${condicao}`);
    return false;
  }
}
