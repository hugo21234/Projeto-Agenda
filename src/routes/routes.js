/**
 * Módulo de rotas HTTP da aplicação.
 *
 * Papel no sistema:
 * - Mapear URL + método HTTP para controllers.
 *
 * Conexão com outros arquivos:
 * - Chama `homeController` para páginas iniciais.
 * - Chama `loginController` para autenticação.
 */
const express = require('express');
const homeController = require('../controllers/homeController');
const loginController = require('../controllers/loginController');
const contactController = require('../controllers/contactController');
const { loginRequired } = require('../middlewares/globalMiddleware');

const router = express.Router();

/**
 * @route GET /
 * @description Página inicial da agenda.
 */
router.get('/', homeController.index);

/**
 * @route GET /login/index
 * @description Página única com formulário de registro e login.
 */
router.get('/login/index', loginController.index);

/**
 * Rotas GET de compatibilidade redirecionadas para um único ponto de entrada.
 * 🧠 Aprendizado: centralizar a UI reduz duplicação de telas.
 */
router.get('/login/login', (req, res) => res.redirect('/login/index'));
router.get('/login/register', (req, res) => res.redirect('/login/index'));

/**
 * @route POST /login/register
 * @description Cria um novo usuário.
 */
router.post('/login/register', loginController.register);

/**
 * @route POST /login/login
 * @description Autentica usuário existente.
 */
router.post('/login/login', loginController.login);

router.post('/login/logout', loginController.logout);

// Rotas de CRUD de contatos.
router.get('/criar-contato/index', loginRequired, contactController.index);
router.post('/criar-contato', loginRequired, contactController.create);
router.get('/contato/index/:id', loginRequired, contactController.editindex);
router.post('/contato/edit/:id', loginRequired, contactController.edit);
router.get('/contato/delete/:id', loginRequired, contactController.delete);
module.exports = router;
