const express = require('express');
const homeController = require('../controllers/homeController');
const loginController = require('../controllers/loginController');

const router = express.Router();

// Rota principal da aplicacao: renderiza a tela inicial.
router.get('/', homeController.index);

// Rota de autenticacao: renderiza a tela de login/cadastro.
router.get('/login/index', loginController.index);
router.get('/login/login', (req, res) => res.redirect('/login/index'));
router.get('/login/register', (req, res) => res.redirect('/login/index'));
router.post('/login/register', loginController.register);
router.post('/login/login', loginController.login);



module.exports = router;
