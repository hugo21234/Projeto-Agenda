/**
 * Model da entidade Home (didático).
 *
 * Papel no sistema:
 * - Exemplo simples de schema/model Mongoose.
 *
 * Conexão com outros arquivos:
 * - Utilizado pelo `homeController` para criação de registro de exemplo.
 */
const mongoose = require('mongoose');

/**
 * Schema da coleção Home.
 */
const HomeSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descricao: String,
});

/**
 * Model para operações na coleção `Home`.
 */
const HomeModel = mongoose.model('Home', HomeSchema);

module.exports = HomeModel;
