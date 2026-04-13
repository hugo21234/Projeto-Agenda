// Middleware de log: ajuda a acompanhar cada request no terminal.
module.exports = (req, res, next) => {
  const dataHora = new Date().toISOString();
  console.log(`[${dataHora}] ${req.method} ${req.url}`);
  // next() entrega o controle para o proximo middleware/rota.
  next();
};
