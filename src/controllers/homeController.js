const HomeModel = require('../models/HomeModel');

exports.index = async (req, res) => {
  try {
    const contatos = await HomeModel.buscaContatos();

    res.render('index', {
      titulo: 'Agenda',
      contatos,
    });
  } catch (e) {
    console.log(e);
    res.render('index', {
      titulo: 'Agenda',
      contatos: [],
    });
  }
};

exports.sobre = (req, res) => {
  res.render('sobre', {
    titulo: 'Sobre o Projeto',
  });
};
