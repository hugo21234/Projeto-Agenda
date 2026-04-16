/**
 * Middleware de logging de requisições.
 *
 * Papel no sistema:
 * - Registrar método e URL para observabilidade durante desenvolvimento.
 *
 * Conexão com outros arquivos:
 * - Aplicado globalmente em `server.js`.
 */
module.exports = (req, res, next) => {
  const dataHora = new Date().toISOString();
  console.log(`[${dataHora}] ${req.method} ${req.url}`);

  // next() é obrigatório para não interromper o fluxo de middlewares/rotas.
  next();
};
