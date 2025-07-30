import { ApiError } from "./apiErrors";

export class PayloadInvalidoError extends ApiError {
  constructor(mensagem: string) {
    super(mensagem, 400, "payload_invalido");
  }
}

export class RegraInvalidaError extends ApiError {
  constructor(campo: string, mensagem: string) {
    super(mensagem, 422, "regra_invalida", campo);
  }
}

export class IdDuplicadoError extends ApiError {
  constructor(campo: string, mensagem: string) {
    super(mensagem, 409, "id_duplicado", campo);
  }
}

export class FormularioNaoEncontradoError extends ApiError {
  constructor(id: string) {
    super(
      `O formulário com id '${id}' não foi localizado ou está inativo.`,
      404,
      "formulario_nao_encontrado"
    );
  }
}

export class FormularioProtegidoError extends ApiError {
  constructor(
    message = "Este formulário é protegido e não pode ser removido manualmente."
  ) {
    super(message, 409, "formulario_protegido");
  }
}

export class InternalServerError extends ApiError {
  constructor() {
    super("Erro interno do servidor", 500, "erro_interno");
  }
}

export class SchemaVersionInvalidaError extends ApiError {
  constructor(mensagem: string) {
    super(mensagem, 422, "schema_version_invalida");
  }
}

export class DependenciaCircularError extends ApiError {
  constructor(mensagem: string) {
    super(mensagem, 500, "dependencia_circular");
  }
}
