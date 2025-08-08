import { env } from '../../config/env';
import * as config from '../../config';

describe('Configurações', () => {
  it('deve ter nodeEnv definido', () => {
    expect(env.nodeEnv).toBeDefined();
  });

  it('deve exportar configuração corretamente', () => {
    expect(config).toBeDefined();
  });
});
