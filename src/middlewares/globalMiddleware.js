// Middleware global: roda em todas as rotas e centraliza dados comuns para as views.
const globalMiddleware = (req, res, next) => {
  // Mensagens flash ficam disponiveis em qualquer renderizacao EJS.
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');

  // Exemplo de dado global para uso na camada de visualizacao.
  res.locals.usuario = req.session?.usuario || null;
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';

  next();
};

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
