/**
 * Middleware global da aplicação.
 *
 * Papel no sistema:
 * - Injetar dados comuns em `res.locals` para todas as views.
 * - Centralizar tratamento de erro CSRF.
 *
 * Conexão com outros arquivos:
 * - Registrado em `server.js` antes das rotas.
 * - Dados definidos aqui são consumidos pelos templates em `views/includes`.
 */

/**
 * Disponibiliza mensagens flash, sessão e token CSRF para o EJS.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const globalMiddleware = (req, res, next) => {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');

  // 🧠 Aprendizado: `res.locals` evita repetir dados em cada `res.render`.
  res.locals.usuario = req.session?.usuario || null;
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';

  next();
};

/**
 * Trata falhas de token CSRF de forma amigável.
 *
 * @param {Error & {code?: string}} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
globalMiddleware.checkCsrfError = (err, req, res, next) => {
  if (err && err.code === 'EBADCSRFTOKEN') {
    return res.render('404', {
      titulo: 'Requisicao invalida',
      mensagem: 'Token CSRF invalido ou expirado. Tente recarregar a pagina.',
    });
  }

  return next(err);
};
globalMiddleware.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
  next();
};

globalMiddleware.loginRequired = (req, res, next) => {
  if (!req.session.usuario) {
    req.flash('errors', 'Voce precisa estar logado para acessar esta pagina.');
    return req.session.save(() => res.redirect('/'));
  }
  return next();
};
module.exports = globalMiddleware;
