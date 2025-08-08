import { RegraInvalidaError } from '../errors/customErrors';

export function validarCampos(campos: any[]) {
  for (const campo of campos) {
    console.log('campo ', campo);
    if (!campo.validacoes) continue;

    const minimo = campo.validacoes.find((v: any) => v.tipo === 'minimo');
    const maximo = campo.validacoes.find((v: any) => v.tipo === 'maximo');

    if (minimo && maximo && minimo.valor > maximo.valor) {
      throw new RegraInvalidaError(
        campo.id,
        `Valor máximo (${maximo.valor}) não pode ser menor que o valor mínimo (${minimo.valor})`,
      );
    }

    const regexValidacao = campo.validacoes.find((v: any) => v.tipo === 'regex');
    if (regexValidacao) {
      try {
        new RegExp(regexValidacao.valor);
      } catch (e) {
        throw new RegraInvalidaError(
          campo.id,
          `Expressão regular inválida: ${regexValidacao.valor}`,
        );
      }
    }
  }
}
