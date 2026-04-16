// src/controllers/homeController.js
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