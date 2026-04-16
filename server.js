/**
 * Arquivo de entrada da aplicação.
 *
 * Papel no sistema:
 * - Montar o app Express.
 * - Configurar segurança, sessões e middlewares globais.
 * - Registrar rotas.
 * - Conectar no MongoDB e iniciar o servidor HTTP.
 *
 * Conexão com outros arquivos:
 * - Usa `src/routes/routes.js` como mapa de endpoints.
 * - Usa `src/middlewares/globalMiddleware.js` para variáveis globais/CSRF.
 * - Usa `src/middlewares/logger.js` para logging de requisições.
 */
require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash = require('connect-flash');
const helmet = require('helmet');
const csrf = require('csurf');

const globalMiddleware = require('./src/middlewares/globalMiddleware');
const loggerMiddleware = require('./src/middlewares/logger');
const routes = require('./src/routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Define EJS como template engine para renderização server-side.
 * 🧠 Aprendizado: separar `views` permite trocar layout sem mexer na regra de negócio.
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * Middlewares base da aplicação.
 * - helmet: reforça headers de segurança.
 * - express.urlencoded/json: interpreta dados recebidos no body.
 * - express.static: publica arquivos estáticos.
 */
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Configuração de sessão persistida no MongoDB.
 *
 * Por que existe:
 * - Manter usuário logado entre requisições.
 * - Permitir flash messages em redirects.
 *
 * ⚠️ Atenção:
 * - Em produção, `secret` deve vir de variável de ambiente forte.
 */
const sessionOptions = session({
  secret: 'sdasfasfafafafafafasfafafafafafafafafafaf',
  store: MongoStore.create({
    mongoUrl: process.env.connectionString,
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(flash());

/**
 * Pipeline global da aplicação.
 * Ordem importa: CSRF precisa de sessão; csrfMiddleware depende de `req.csrfToken`.
 */
app.use(csrf());
app.use(globalMiddleware);
app.use(loggerMiddleware);
app.use(globalMiddleware.csrfMiddleware);

/**
 * Registro central das rotas.
 * Todas as rotas definidas em `routes` passam a ficar sob `/`.
 */
app.use('/', routes);

/**
 * Tratamento específico de erro CSRF.
 * Quando chamado: se middleware `csrf` detectar token inválido/ausente.
 */
app.use(globalMiddleware.checkCsrfError);

/**
 * Fallback 404 para qualquer rota não encontrada.
 */
app.use((req, res) => {
  res.status(404).render('404', {
    titulo: 'Pagina nao encontrada',
    mensagem: 'A rota que voce tentou acessar nao existe.',
  });
});

/**
 * Conecta no banco e, após sucesso, dispara evento interno para iniciar o servidor.
 * 🧠 Aprendizado: evitar receber request antes do banco estar pronto.
 */
mongoose
  .connect(process.env.connectionString)
  .then(() => {
    console.log('Conectado ao MongoDB Atlas');
    app.emit('dbConnected');
  })
  .catch((err) => {
    console.log('Erro ao conectar ao MongoDB Atlas:', err);
  });

/**
 * Inicia servidor HTTP somente após conexão com MongoDB.
 */
app.on('dbConnected', () => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
