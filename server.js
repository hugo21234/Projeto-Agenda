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

// Configuracao base do template engine.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares nativos e de seguranca.
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sessao persistida no MongoDB para manter login/estado entre requisicoes.
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

// nossos middlewares personalizados: logger e globalMiddleware.
app.use(csrf());
app.use(globalMiddleware);
app.use(loggerMiddleware);
app.use(globalMiddleware.csrfMiddleware);

// Registro central das rotas da aplicacao.
app.use('/', routes);

// Tratamento de erro especifico de CSRF.
app.use(globalMiddleware.checkCsrfError);

// Fallback global para rotas nao encontradas.
app.use((req, res) => {
  res.status(404).render('404', {
    titulo: 'Pagina nao encontrada',
    mensagem: 'A rota que voce tentou acessar nao existe.',
  });
});

// Conecta no banco antes de liberar o servidor HTTP.
mongoose
  .connect(process.env.connectionString)
  .then(() => {
    console.log('Conectado ao MongoDB Atlas');
    app.emit('dbConnected');
  })
  .catch((err) => {
    console.log('Erro ao conectar ao MongoDB Atlas:', err);
  });

// So sobe o servidor quando o banco estiver pronto.
app.on('dbConnected', () => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});