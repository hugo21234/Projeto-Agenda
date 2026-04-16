/**
 * Configuração de build do Webpack.
 *
 * Papel no sistema:
 * - Transformar `webpackage/src/index.js` em bundle único para o navegador.
 *
 * Conexão com outros arquivos:
 * - O bundle gerado é referenciado por `views/includes/footer.ejs`.
 */
const path = require('path');

module.exports = {
  entry: './webpackage/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/assets'),
  },
};
