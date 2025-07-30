import { RespostasService } from "../../../../src/services/respostas.service";
import { RespostasRepository } from "../../../../src/repository/respostas.repository";
import { FormulariosRepository } from "../../../../src/repository/formularios.repository";
import {
  FormularioNaoEncontradoError,
  PayloadInvalidoError,
} from "../../../../src/errors/customErrors";

jest.mock("../../../../src/repository/respostas.repository");
jest.mock("../../../../src/repository/formularios.repository");

describe("RespostasService", () => {
  let service: RespostasService;
  let repoMock: jest.Mocked<RespostasRepository>;
  let formRepoMock: jest.Mocked<FormulariosRepository>;

  beforeEach(() => {
    repoMock = new RespostasRepository() as jest.Mocked<RespostasRepository>;
    formRepoMock =
      new FormulariosRepository() as jest.Mocked<FormulariosRepository>;
    service = new RespostasService();
    (service as any).repo = repoMock;
    (service as any).formRepo = formRepoMock;
  });

  it("deve lançar erro se formulário não existe", async () => {
    formRepoMock.findById.mockResolvedValue(null);

    await expect(
      service.removerResposta("form1", "resp1", "user")
    ).rejects.toThrow(FormularioNaoEncontradoError);
  });

  it("deve marcar resposta como inativa com sucesso", async () => {
    formRepoMock.findById.mockResolvedValue({
      id: "form1",
      isAtivo: true,
    } as any);
    repoMock.softDeleteResposta.mockResolvedValue({
      id: "resp1",
      isAtivo: true,
    } as any);

    const result = await service.removerResposta("form1", "resp1", "user");
    expect(result.status).toBe("soft_deleted");
  });

  it("deve retornar mensagem se resposta já está inativa", async () => {
    formRepoMock.findById.mockResolvedValue({
      id: "form1",
      isAtivo: true,
    } as any);
    repoMock.softDeleteResposta.mockResolvedValue(null);

    const result = await service.removerResposta("form1", "resp1", "user");
    expect(result.mensagem).toContain("já estava inativa");
  });

  it("deve lançar PayloadInvalidoError se campo obrigatório está ausente", async () => {
    formRepoMock.findById.mockResolvedValue({
      id: "1",
      isAtivo: true,
      schemaVersion: 1,
      campos: [{ campoId: "autorizacao", obrigatorio: true, tipo: "boolean" }],
    } as any);

    await expect(
      service.criarResposta("1", { respostas: { idade: 17 } }) // Falta "autorizacao"
    ).rejects.toThrow(PayloadInvalidoError);
  });
});
