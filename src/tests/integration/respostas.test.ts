import request from 'supertest';
import app from '../../app';

describe('Respostas API', () => {
  let formId: string;

  beforeAll(async () => {
    const uniqueName = `Ficha de Respostas Teste ${Date.now()}`;

    const form = await request(app)
      .post('/api/v1/formularios')
      .send({
        nome: uniqueName,
        campos: [
          { id: 'idade', label: 'Idade', tipo: 'number', obrigatorio: true },
          {
            id: 'autorizacao',
            label: 'Autorização',
            tipo: 'boolean',
            obrigatorio: true,
            condicional: 'idade < 18',
          },
        ],
      });

    // ⚠️ ajuste conforme o retorno real da sua API (se for `form.body.id` ou `form.body.formulario.id`)
    formId = form.body.id;
  });

  it('deve enviar resposta válida (idade >= 18, sem autorização)', async () => {
    const res = await request(app)
      .post(`/api/v1/formularios/${formId}/respostas`)
      .send({ respostas: { idade: 20 } });

    expect(res.status).toBe(201);
    expect(res.body.mensagem).toBe('Resposta registrada com sucesso.');
  });

  it('deve exigir autorização quando idade < 18', async () => {
    const res = await request(app)
      .post(`/api/v1/formularios/${formId}/respostas`)
      .send({ respostas: { idade: 16 } });

    expect(res.status).toBe(400);
    expect(res.body.mensagem).toContain('autorizacao');
  });
});
