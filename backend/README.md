# Form Engine - Desafio Desenvolvedor Pleno

## 📌 Visão Geral

Este projeto implementa o núcleo de uma **engine de formulários inteligentes**, permitindo:

- **Criação dinâmica de formulários**
- **Gerenciamento de versões de schema**
- **Submissão de respostas com campos calculados automáticos**
- **Validação de campos e regras condicionais**
- **Rastreabilidade e auditoria completa**

A solução tem foco em **arquitetura limpa**, **qualidade de código** e **boas práticas de engenharia**.

---

## 📂 Tecnologias Utilizadas

- **Node.js** + **TypeScript**
- **Express.js** (API REST)
- **PostgreSQL** (persistência de dados)
- **Prisma ORM** (modelagem e queries)
- **Zod** (validação de schemas e geração de tipos)
- **Morgan** (logs HTTP em desenvolvimento)
- **Jest** (testes automatizados)

---

## 📜 Endpoints Principais (MVP)

## 📜 Endpoints Principais (MVP)

- `POST /formularios` → Criar novo formulário dinâmico (**implementado**)
- `GET /formularios` → Listar formulários (**implementado com validação de query params**)
- `GET /formularios/:id` → Detalhar formulário específico (**implementado**)
- `DELETE /formularios/:id` → Remover logicamente um formulário (**implementado com proteção para formulários protegidos**)
- `PUT /formularios/:id/schema_version` → Criar nova versão do schema (**implementado com validação robusta e detecção de ciclos**)
- `POST /formularios/:id/respostas` → Submeter respostas (**implementado com validação condicional e cálculos automáticos**)
- `GET /formularios/:id/respostas` → Listar respostas (**implementado com paginação e filtros**)
- `DELETE /formularios/:id/respostas/:id_resposta` → Remover resposta logicamente (**implementado**)

---

## ⚙️ Pré-requisitos

- **Node.js** >= 18
- **PostgreSQL** >= 13
- **npm** >= 9

---

## Estrutura do Projeto

### Estrutura de Configuração

- `config/env.ts` → Carrega variáveis de ambiente (.env)
- `config/prisma.ts` → Conexão com banco de dados via Prisma
- `config/index.ts` → Exporta todas as configurações

### Estrutura de Código

- `controllers/` → Lida com entrada/saída HTTP
- `services/` → Regras de negócio
- `repository/` → Comunicação com banco de dados
- `dto/` → Schemas de validação com **Zod**
- `routes/` → Definição de endpoints
- `middlewares/` → Tratamento global (erros, autenticação, etc.)
- `utils/` → Funções auxiliares
- `errors/` → Exceções customizadas

---

## 🔧 Setup do Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/form-engine.git
   cd form-engine
   ```
2. Instale dependências:
   ```bash
   npm install
   ```
3. Configure variáveis de ambiente:
   ```bash
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/form_engine?schema=public"
   PORT=8080
   ```
4. Configure o banco de dados:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Rode o projeto:
   ```bash
   npm run dev
   ```

## 🧪 Testes

```bash
npm test
```

## 📄 Tratamento de Erros

Os erros seguem os padrões definidos no desafio técnico:

### 400 – Payload inválido

```json
{
  "erro": "payload_invalido",
  "mensagem": "O campo 'campos' deve conter ao menos um item válido"
}
```

### 422 – Regra inválida

```json
{
  "erro": "regra_invalida",
  "campo": "idade",
  "mensagem": "Valor máximo não pode ser menor que o valor mínimo"
}
```

### 409 – ID duplicado

```json
{
  "erro": "id_duplicado",
  "campo": "nome_completo",
  "mensagem": "Já existe um campo com o id 'nome_completo'"
}
```

### 404 – Formulário não encontrado

```json
{
  "erro": "formulario_nao_encontrado",
  "mensagem": "O formulário com id 'formulario_001' não foi localizado ou está inativo."
}
```

### 500 – Erro interno

```json
{ "erro": "erro_interno", "mensagem": "Erro interno do servidor" }
```

### Implementação Técnica:

Middleware errorHandler captura e converte erros em respostas padronizadas.

Erros customizados (ApiError, IdDuplicadoError, PayloadInvalidoError, FormularioNaoEncontradoError, etc.) representam cenários de negócio.

Erros de validação de entrada são tratados automaticamente pelo Zod.

## 📄 Decisões Arquiteturais

**1. Validação com Zod: garante entrada consistente e gera tipos automaticamente.**

**2. Soft Delete: mantém histórico de dados.**

**3. Prisma ORM: simplifica o acesso ao banco e migrações.**

**4. Arquitetura em camadas (Controller → Service → Repository).**

**5. Middlewares: para centralizar tratamento de erros e validação.**

**6. Validação robusta de schemas: detecta duplicidade de IDs e ciclos de dependências.**

**7. Validação robusta: detecta duplicidade de IDs, ciclos de dependência e valores inválidos.**

## Exemplos de Uso

### POST /formularios

**Requisição**

```json
{
  "nome": "Ficha de Admissão",
  "descricao": "Formulário usado no onboarding de colaboradores",
  "campos": [
    {
      "id": "nome_completo",
      "label": "Nome completo",
      "tipo": "text",
      "obrigatorio": true
    }
  ]
}
```

**Resposta**

```json
{
  "id": "formulario_001",
  "schema_version": 1,
  "mensagem": "Formulário criado com sucesso",
  "criado_em": "2024-01-15T10:34:00Z"
}
```

### GET /formularios

**Com filtros e paginação**

```bash
GET /api/v1/formularios?nome=onboarding&pagina=2&tamanho_pagina=10&ordenar_por=criado_em&ordem=desc
```

**Resposta**

```json
{
  "pagina_atual": 2,
  "total_paginas": 5,
  "total_itens": 47,
  "formularios": [
    {
      "id": "formulario_001",
      "nome": "Onboarding RH",
      "schema_version": 2,
      "criado_em": "2024-01-15T10:34:00Z"
    }
  ]
}
```

**Erro (parâmetro inválido)**

```json
{
  "erro": "payload_invalido",
  "mensagem": "O parâmetro tamanho_pagina deve ser menor ou igual a 100."
}
```

### GET /formularios/:id

Retorna todos os detalhes de um formulário, incluindo seus campos (inclusive calculated).

**Exemplo de resposta**

```json
{
  "id": "formulario_001",
  "nome": "Formulário de Onboarding RH",
  "descricao": "Formulário utilizado no processo de integração de novos colaboradores.",
  "schema_version": 2,
  "criado_em": "2024-01-15T10:34:00Z",
  "campos": [
    {
      "id": "nome_completo",
      "label": "Nome completo",
      "tipo": "text",
      "obrigatorio": true,
      "propriedades": {}
    },
    {
      "id": "data_nascimento",
      "label": "Data de nascimento",
      "tipo": "date",
      "obrigatorio": true,
      "propriedades": {}
    },
    {
      "id": "idade",
      "label": "Idade",
      "tipo": "calculated",
      "formula": "floor((today() - data_nascimento) / 365.25)",
      "dependencias": ["data_nascimento"]
    }
  ]
}
```

**Erro – não encontrado**

```json
{
  "erro": "formulario_nao_encontrado",
  "mensagem": "O formulário com id 'formulario_999' não foi localizado ou está inativo."
}
```

### DELETE /formularios/:id

**Sucesso**

```json
{
  "mensagem": "Formulário 'formulario_abc' marcado como removido com sucesso.",
  "status": "soft_deleted"
}
```

**Erro (protegido)**

```json
{
  "erro": "formulario_protegido",
  "mensagem": "Este formulário é protegido e não pode ser removido manualmente."
}
```

**Erro (não encontrado)**

```json
{
  "erro": "formulario_nao_encontrado",
  "mensagem": "O formulário com id 'formulario_abc' não foi localizado ou está inativo."
}
```

### PUT /formularios/:id/schema_version

Cria uma nova versão do schema substituindo totalmente os campos anteriores.
Valida duplicidade de IDs de campos, consistência de tipos e detecta dependências circulares em campos calculados.

**Requisição**

```json
{
  "schema_version": 3,
  "nome": "Formulário de Cadastro de Pessoas (v3)",
  "descricao": "Versão revisada com validações de idade e ocupação",
  "campos": [
    { "id": "nome_completo", "tipo": "text", "label": "Nome completo" },
    { "id": "data_nascimento", "tipo": "date", "label": "Data de nascimento" },
    {
      "id": "idade",
      "tipo": "calculated",
      "formula": "floor((today() - data_nascimento) / 365.25)",
      "dependencias": ["data_nascimento"]
    },
    {
      "id": "e_maior_de_idade",
      "tipo": "calculated",
      "formula": "idade >= 18",
      "dependencias": ["idade"]
    }
  ]
}
```

**Resposta de sucesso**

```json
{
  "mensagem": "Versão atualizada com sucesso.",
  "id": "formulario_001",
  "schema_version_anterior": 2,
  "schema_version_nova": 3,
  "atualizado_em": "2024-03-15T15:20:00Z"
}
```

**Erro – versão inferior ou igual**

```json
{
  "erro": "regra_invalida",
  "campo": "schema_version",
  "mensagem": "A versão 2 é inferior ou igual à versão atual (2)."
}
```

**Erro – dependências circulares**

```json
{
  "erro": "regra_invalida",
  "campo": "campos",
  "mensagem": "Dependências circulares detectadas nos campos: a, b"
}
```

## **POST /formularios/:id/respostas**

**Exemplo de requisição**

```json
{
  "respostas": {
    "nome_completo": "Maria Santos",
    "data_nascimento": "1995-02-14",
    "ocupacao": "ti"
  }
}
```

**Exemplo de resposta**

```json{
  "mensagem": "Resposta registrada com sucesso.",
  "id_resposta": "resposta_12345",
  "calculados": {
    "idade": 30,
    "e_maior_de_idade": true
  },
  "executado_em": "2024-03-15T22:12:01Z"
}
```

**Erros**

```json
{
  "erro": "payload_invalido",
  "mensagem": "Campos obrigatórios ausentes: autorizacao"
}
```

**Campos calculados enviados indevidamente**

```json
{
  "erro": "payload_invalido",
  "mensagem": "Campos calculados não devem ser enviados: idade"
}
```

**Formulário não encontrado**

```json
{
  "erro": "formulario_nao_encontrado",
  "mensagem": "O formulário com id 'formulario_999' não foi localizado ou está inativo."
}
```

## **GET /formularios/:id/respostas**

**Exemplo de requisição**

```bash
GET /formularios/formulario_001/respostas?pagina=1&tamanho_pagina=10&incluir_calculados=true&campo_ocupacao=ti
```

**Exemplo de Resposta**

```json
{
  "pagina": 1,
  "tamanho_pagina": 10,
  "total": 42,
  "resultados": [
    {
      "id_resposta": "resposta_67890",
      "criado_em": "2024-03-15T22:10:01Z",
      "schema_version": 3,
      "respostas": {
        "nome_completo": "Maria Santos",
        "data_nascimento": "1995-02-14",
        "ocupacao": "ti"
      },
      "calculados": {
        "idade": 30,
        "e_maior_de_idade": true
      }
    }
  ]
}
```

## **DELETE /formularios/:id/respostas/:id_resposta**

**Exemplo de resposta (sucesso)**

```json
{
  "mensagem": "Resposta 'resposta_001' marcada como inativa com sucesso.",
  "status": "soft_deleted"
}
```

**Exemplo de resposta (já removida)**

```json
{
  "mensagem": "A resposta já estava inativa ou não existe.",
  "status": "soft_deleted"
}
```

## **Logs de Execução**

`Cada submissão gera logs detalhados:`

1. Campos ignorados por condicional

2. Valores calculados

3. Usuário responsável (quando disponível)

**Exemplo de log (arquivo logs/execucao.log):**

```json
{
  "level": "info",
  "message": "Execução de submissão de formulário",
  "formularioId": "formulario_001",
  "schemaVersion": 3,
  "usuario": "usuario_admin",
  "ignoradosPorCondicional": ["campo_x", "campo_y"],
  "calculados": { "idade": 30, "e_maior_de_idade": true },
  "timestamp": "2024-03-15T22:12:01Z"
}
```

## Documentação da API

A documentação interativa está disponível em:
[http://localhost:8080/api-docs](http://localhost:8080/api-docs)

A documentação é gerada automaticamente via **Swagger** a partir dos comentários nas rotas.

## 👨‍💻 Autor

### Desenvolvido por LUIS FILIPE JOAQUIM DE ALENCAR como parte do desafio técnico para a posição de Desenvolvedor Pleno do Sistema FIEPE.
