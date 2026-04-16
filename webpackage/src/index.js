/**
 * Entry point do JavaScript de front-end empacotado pelo Webpack.
 *
 * Papel no sistema:
 * - Inicializar scripts executados no navegador.
 *
 * Conexão com outros arquivos:
 * - Referenciado em `webpack.config.js` como `entry`.
 * - Resultado final é servido em `public/assets/bundle.js` e carregado no footer EJS.
 */

// 🧠 Aprendizado: manter um ponto de entrada único facilita escalar JS do cliente.
console.log('Bundle do webpack carregado com sucesso.');
