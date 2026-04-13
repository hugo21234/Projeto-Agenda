const mongoose = require('mongoose');

// Schema define o formato e as validacoes do documento na collection.
const HomeSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true },
    descricao: String
});

// Model e a interface para consultar e manipular dados da collection Home.
const HomeModel =mongoose.model('Home', HomeSchema);

module.exports = HomeModel;