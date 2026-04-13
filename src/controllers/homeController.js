const HomeModel = require('../models/HomeModel');

// Exemplo didatico: cria um documento de teste ao carregar o controller.
// Em producao, esse tipo de escrita deve ficar em uma rota/servico especifico.
HomeModel.create({
    titulo: 'Título de exemplo',
    descricao: 'Descrição de exemplo'
})
.then(dados => console.log(dados))
.catch(err => console.error('Erro ao criar documento:', err));

// Controller da rota GET /.
// Recebe request, processa dados e delega a resposta para a view index.ejs.
exports.index = (req, res) => {
  console.log(req.session.usuario);
  res.render('index', {
    titulo: 'Modelo Express',
    descricao: 'Projeto com Express Router, Controllers, Views, arquivos estaticos e Middlewares em pastas separadas.'
  });
};

// Controller da rota GET /sobre.
exports.sobre = (req, res) => {
  res.render('sobre', {
    titulo: 'Sobre o Projeto'
  });
};
