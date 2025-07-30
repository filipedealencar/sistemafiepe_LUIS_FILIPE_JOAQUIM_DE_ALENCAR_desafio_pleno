export interface Campo {
  campoId: string;
  label: string;
  tipo: string;
  obrigatorio: boolean;
  propriedades: Record<string, any>;
}

export interface Form {
  id: string;
  nome: string;
  descricao: string;
  schemaVersion: number;
  dataCriacao: string;
  campos: Campo[];
}

export interface CampoResponse {
  id: string;
  label: string;
  tipo: string;
  obrigatorio: boolean;
  propriedades: Record<string, any>;
}

export interface FormResponse {
  id: string;
  nome: string;
  descricao: string;
  schema_version: number;
  criado_em: string;
  campos: CampoResponse[];
}
