const express = require('express');
const homeController = require('../controllers/homeController');
const loginController = require('../controllers/loginController');
const contactController = require('../controllers/contactController');
const { loginRequired } = require('../middlewares/globalMiddleware');

const router = express.Router();

// Rota principal da aplicacao: renderiza a tela inicial.
router.get('/', homeController.index);

// Rota de autenticacao: renderiza a tela de login/cadastro.
router.get('/login/index', loginController.index);
router.get('/login/login', (req, res) => res.redirect('/login/index'));
router.get('/login/register', (req, res) => res.redirect('/login/index'));
router.post('/login/register', loginController.register);
router.post('/login/login', loginController.login);
router.post('/login/logout', loginController.logout);
//rota de crud
router.get('/criar-contato/index', loginRequired, contactController.index);
router.post('/criar-contato', contactController.create);
router.delete('/deletar-contato/:id', contactController.delete);
router.get('/contato/index/:id', loginRequired, contactController.editindex);
router.post('/contato/edit/:id', loginRequired, contactController.edit);
router.get('/contato/delete/:id', loginRequired, contactController.delete);
module.exports = router;
