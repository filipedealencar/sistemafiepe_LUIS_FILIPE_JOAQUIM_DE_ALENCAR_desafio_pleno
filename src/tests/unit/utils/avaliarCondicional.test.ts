import { avaliarCondicional } from '../../../utils/avaliarCondicional';

describe('avaliarCondicional - coerção automática de valores', () => {
  it('deve interpretar string numérica corretamente', () => {
    const contexto = { idade: '20' };
    const condicao = 'idade < 18';
    const resultado = avaliarCondicional(condicao, contexto);
    expect(resultado).toBe(false);
  });

  it('deve interpretar string booleana corretamente', () => {
    const contexto = { ativo: 'true' };
    const condicao = 'ativo == true';
    const resultado = avaliarCondicional(condicao, contexto);
    expect(resultado).toBe(true);
  });

  it('deve retornar true para idade >= 18 (sem exigir campo extra)', () => {
    const contexto = { idade: '18' };
    const condicao = 'idade >= 18';
    const resultado = avaliarCondicional(condicao, contexto);
    expect(resultado).toBe(true);
  });

  it('deve lançar erro em expressão inválida quando strict=true', () => {
    const contexto = { idade: 20 };
    const condicao = 'idade >>> 18'; // inválida
    expect(() => avaliarCondicional(condicao, contexto, true)).toThrow(
      'Expressão condicional inválida',
    );
  });
});
