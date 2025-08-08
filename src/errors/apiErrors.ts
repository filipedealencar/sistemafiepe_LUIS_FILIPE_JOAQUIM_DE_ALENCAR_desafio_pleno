export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly erro: string;
  public readonly campo?: string;

  constructor(message: string, statusCode: number, erro: string, campo?: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.erro = erro;
    this.campo = campo;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
