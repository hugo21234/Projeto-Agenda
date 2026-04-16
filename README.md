# Projeto Agenda (Node.js + Express) — Guia de Aprendizado

Este README foi escrito com foco em **entendimento de arquitetura**, **fluxo do Express** e **boas práticas de backend**.

---

## 1) Visão geral do sistema

O projeto é uma aplicação web server-side com:

- **Express** para receber requisições HTTP e responder com views EJS.
- **EJS** para renderização dinâmica no servidor.
- **MongoDB (Mongoose)** para persistência de usuários.
- **Sessão + flash messages** para manter autenticação e feedback de erro/sucesso.
- **CSRF + Helmet** para segurança básica de aplicação web.

### O problema que ele resolve

A aplicação simula uma agenda com autenticação (registro e login), exibindo uma interface inicial e um fluxo de acesso ao sistema.

### Por que esta abordagem é boa para aprender?

Porque você pratica na prática o que todo backend em Express precisa dominar:

1. Entrada HTTP (`req`)
2. Processamento em camadas (route → controller → model)
3. Segurança
4. Estado de sessão
5. Saída HTML (`res.render`)

---

## 2) Arquitetura (pastas e responsabilidades)

## Estrutura

```text
.
├── server.js
├── src
│   ├── routes
│   │   └── routes.js
│   ├── controllers
│   │   ├── homeController.js
│   │   └── loginController.js
│   ├── middlewares
│   │   ├── globalMiddleware.js
│   │   └── logger.js
│   └── models
│       ├── HomeModel.js
│       └── LoginModel.js
├── views
│   ├── includes
│   │   ├── head.ejs
│   │   ├── nav.ejs
│   │   ├── messages.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── sobre.ejs
│   └── 404.ejs
├── webpackage
│   └── src
│       └── index.js
├── frontend
│   ├── main.js
│   └── assets/css/style.css
└── webpack.config.js
```

## Responsabilidade de cada camada

- **`server.js`**: composição da aplicação (configura Express, middlewares, sessão, CSRF, conexão com banco e start do servidor).
- **`src/routes`**: mapeia endpoints HTTP para controllers.
- **`src/controllers`**: coordena fluxo da requisição (valida entrada, chama model, decide resposta).
- **`src/models`**: regras de domínio + acesso a dados (Mongoose e validações de usuário).
- **`src/middlewares`**: comportamentos transversais (logs, dados globais, proteção CSRF).
- **`views`**: camada de apresentação (EJS).
- **`webpackage/src`**: ponto de entrada do JS cliente empacotado no bundle.
- **`frontend`**: artefatos/estáticos auxiliares (neste projeto, ainda pouco utilizado).

> 🧠 **Por que separar em camadas?**
> Para manter cada parte focada em uma responsabilidade. Isso reduz acoplamento e melhora manutenção/testabilidade.

---

## 3) Fluxo de requisição (request → response)

Exemplo de **POST `/login/login`**:

1. Navegador envia formulário com email/senha + `_csrf`.
2. Express recebe no `server.js`.
3. Middlewares globais executam (helmet, parser, sessão, flash, csrf, globais, logger).
4. Router encontra rota `POST /login/login`.
5. `loginController.login` cria instância de `LoginModel` (classe de domínio).
6. Model faz `cleanUp`, valida, busca usuário e compara senha com bcrypt.
7. Controller decide:
   - Erro: grava flash de erro e redireciona para `/login/index`.
   - Sucesso: grava usuário na sessão e redireciona para `/`.
8. Próxima página renderiza mensagens com `views/includes/messages.ejs`.

### Por que usar `req.session.save` antes de redirecionar?

Porque gravação de sessão é assíncrona; salvar explicitamente evita perder dados de flash/usuário antes do redirect.

---

## 4) Palavras-chave do Express explicadas

- **`app.use(...)`**: registra middleware (executa antes das rotas ou entre etapas).
- **`express.Router()`**: cria módulo de rotas reutilizável.
- **`req`**: requisição HTTP (dados do cliente, params, body, sessão).
- **`res`**: resposta HTTP (`res.render`, `res.redirect`, `res.json`, etc.).
- **`next()`**: passa controle para próximo middleware/handler.
- **`res.locals`**: variáveis disponíveis em todas as views da requisição atual.
- **`res.render('view', dados)`**: renderiza template EJS no servidor.
- **`app.set('view engine', 'ejs')`**: define engine de template.

---

## 5) Boas práticas aplicadas

- ✅ Organização em camadas (routes/controllers/models/middlewares).
- ✅ Hash de senha com bcrypt antes de persistir.
- ✅ Sessão persistida no Mongo (escalável para múltiplas instâncias).
- ✅ Proteção CSRF em formulários sensíveis.
- ✅ Helmet para headers de segurança.
- ✅ Flash messages para UX de erro/sucesso.

### O “porquê” disso

Essas práticas aumentam **segurança**, **clareza arquitetural** e **evolução futura** do projeto.

---

## 6) Pontos de melhoria

1. **Mover side-effect do `homeController`** (criação automática de documento) para seed/script explícito.
2. **Remover export duplicado de tratamento CSRF** no middleware global para evitar ambiguidade.
3. **Extrair secrets para `.env`** (session secret não deve ficar hardcoded).
4. **Criar camada `services/`** para regras de negócio mais complexas.
5. **Adicionar testes** (unitários no model/service + integração nas rotas).
6. **Padronizar idioma e acentuação** nas mensagens de usuário.
7. **Implementar logout** e proteção de rotas autenticadas.

---

## 7) Explicação das rotas

### Públicas

- `GET /`
  - Renderiza a home (`index.ejs`).
- `GET /login/index`
  - Renderiza tela com formulário de registro e login.
- `GET /login/login` e `GET /login/register`
  - Redirecionam para `/login/index` para concentrar UX em uma tela.

### Autenticação

- `POST /login/register`
  - Valida email/senha.
  - Verifica usuário existente.
  - Criptografa senha.
  - Salva usuário, grava sessão e redireciona.

- `POST /login/login`
  - Valida payload.
  - Busca usuário por email.
  - Compara senha hash.
  - Cria sessão e redireciona.

### Tratamento global

- Erro de CSRF: renderiza tela de erro amigável.
- Rota não encontrada: fallback com `404.ejs`.

---

## 8) Glossário técnico

- **Middleware**: função entre request e response, usada para validação, logging, autenticação etc.
- **Controller**: camada que orquestra o caso de uso HTTP.
- **Model**: camada de dados/domínio, responsável por persistência e validações.
- **Session**: estado do usuário armazenado entre requisições.
- **Flash message**: mensagem temporária para próxima renderização.
- **CSRF**: ataque de requisição forjada; token CSRF mitiga esse risco.
- **Hash de senha**: transformação irreversível para armazenar senha com segurança.
- **View Engine**: mecanismo que transforma template em HTML (EJS).

---

## Como um júnior evolui para pleno com este projeto

1. **Domine o fluxo completo** (request → middleware → controller → model → view).
2. **Refatore com intenção** (remova efeitos colaterais e centralize regra de negócio).
3. **Adicione testes em camadas** (primeiro model, depois controller/rota).
4. **Melhore segurança continuamente** (rate limit, validações mais robustas, logs estruturados).
5. **Observe legibilidade**: código explícito e documentação curta + útil.

Se você conseguir explicar cada arquivo deste projeto para outra pessoa, com foco no “porquê”, já está no caminho certo para o nível pleno.
