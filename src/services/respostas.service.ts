import logger from '../config/logger';
import { RespostaSchema, RespostaInput } from '../dto/resposta.schema';
import { RespostasQuery } from '../dto/respostas.query.schema';
import {
  CampoReservadoError,
  FormularioNaoEncontradoError,
  PayloadInvalidoError,
} from '../errors/customErrors';
import { FormulariosRepository } from '../repository/formularios.repository';
import { RespostasRepository } from '../repository/respostas.repository';
import { avaliarCondicional } from '../utils/avaliarCondicional';
import { calcularCampos } from '../utils/calculadoraCampos';

interface CampoFormulario {
  campoId: string;
  tipo: string;
  obrigatorio?: boolean;
  condicional?: any;
}

export class RespostasService {
  private formRepo: FormulariosRepository;
  private repo: RespostasRepository;

  constructor() {
    this.formRepo = new FormulariosRepository();
    this.repo = new RespostasRepository();
  }

  async criarResposta(formularioId: string, payload: any) {
    const data: RespostaInput = RespostaSchema.parse(payload);

    const form = await this.formRepo.findById(formularioId);
    if (!form) {
      throw new FormularioNaoEncontradoError(formularioId);
    }

    const schemaVersion = data.schema_version || form.schemaVersion;

    const camposFaltando: string[] = [];

    for (const campo of form.campos) {
      let deveValidar = false;

      if (campo.obrigatorio) {
        if (!campo.condicional) {
          deveValidar = true;
        } else if (avaliarCondicional(campo.condicional, data.respostas)) {
          deveValidar = true;
        }
      }

      if (campo.campoId === 'autorizacao') {
        const idade = data.respostas?.idade;
        if (typeof idade === 'number' && idade >= 18) {
          deveValidar = false;
        }
      }

      if (deveValidar && !(campo.campoId in data.respostas)) {
        camposFaltando.push(campo.campoId);
      }
    }

    if (camposFaltando.length > 0) {
      throw new PayloadInvalidoError(`Campos obrigatórios ausentes: ${camposFaltando.join(', ')}`);
    }

    const campoCalculadoEnviado = form.campos.find(
      (c: CampoFormulario) => c.tipo === 'calculated' && c.campoId in data.respostas,
    );

    if (campoCalculadoEnviado) {
      throw new CampoReservadoError(campoCalculadoEnviado.campoId);
    }

    // --- Salva resposta no banco ---
    const resposta = await this.repo.createResposta(formularioId, schemaVersion, data.respostas);

    // --- Campos ignorados por condicional (para log) ---
    const ignoradosPorCondicional: string[] = [];
    for (const campo of form.campos) {
      if (campo.condicional && !avaliarCondicional(campo.condicional, data.respostas)) {
        ignoradosPorCondicional.push(campo.campoId);
      }
    }

    // --- Calcula campos derivados ---
    const calculados = calcularCampos(form, data.respostas);

    // --- Log ---
    logger.info('Execução de submissão de formulário', {
      formularioId,
      schemaVersion,
      usuario: 'desconhecido',
      ignoradosPorCondicional,
      calculados,
      timestamp: new Date().toISOString(),
    });

    return {
      mensagem: 'Resposta registrada com sucesso.',
      id_resposta: resposta.id,
      calculados,
      executado_em: new Date().toISOString(),
    };
  }

  async listarRespostas(formularioId: string, query: RespostasQuery) {
    const form = await this.formRepo.findById(formularioId);
    if (!form) {
      throw new FormularioNaoEncontradoError(formularioId);
    }

    const resultado = await this.repo.findRespostas(formularioId, query);

    return resultado;
  }

  async removerResposta(formularioId: string, respostaId: string, usuario: string) {
    const form = await this.formRepo.findById(formularioId);
    if (!form) {
      throw new FormularioNaoEncontradoError(formularioId);
    }
    if (!form.isAtivo) {
      throw new PayloadInvalidoError(
        'Este formulário foi desativado e não permite alterações em suas respostas.',
      );
    }

    const resposta = await this.repo.softDeleteResposta(formularioId, respostaId, usuario);

    if (!resposta) {
      return {
        mensagem: 'A resposta já estava inativa ou não existe.',
        status: 'soft_deleted',
      };
    }

    return {
      mensagem: `Resposta '${respostaId}' marcada como inativa com sucesso.`,
      status: 'soft_deleted',
    };
  }
}
