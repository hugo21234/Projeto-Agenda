/**
 * Controller de autenticação.
 *
 * Papel no sistema:
 * - Orquestrar cadastro e login de usuários.
 * - Intermediar request/response entre rotas e model de login.
 *
 * Conexão com outros arquivos:
 * - Usa `LoginModel` para validações e acesso ao MongoDB.
 * - Renderiza `views/login.ejs` e redireciona para rotas existentes.
 */
const LoginModel = require('../models/LoginModel');

/**
 * Exibe tela de autenticação.
 *
 * @route GET /login/index
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
exports.index = (req, res) => {
  res.render('login', {
    titulo: 'Login',
  });
};

/**
 * Cria um novo usuário.
 *
 * @route POST /login/register
 * @param {import('express').Request} req - Dados do formulário (email, password).
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 *
 * Por que existe:
 * - Concentrar fluxo de cadastro (validação, persistência, feedback, sessão).
 */
exports.register = async function register(req, res) {
  try {
    const login = new LoginModel(req.body);
    await login.register();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      return req.session.save(function saveSessionOnRegisterError() {
        return res.redirect('/login/index');
      });
    }

    req.flash('success', 'Cadastro realizado com sucesso');
    req.session.usuario = login.user;

    return req.session.save(function saveSessionOnRegisterSuccess() {
      return res.redirect('/');
    });
  } catch (e) {
    console.log(e);
    req.flash('errors', ['Erro ao processar o cadastro']);
    return req.session.save(function saveSessionOnRegisterException() {
      return res.redirect('/login/index');
    });
  }
};

/**
 * Autentica usuário existente.
 *
 * @route POST /login/login
 * @param {import('express').Request} req - Credenciais enviadas pelo cliente.
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 *
 * Quando é chamada:
 * - Ao submeter formulário de login na view `login.ejs`.
 */
exports.login = async function login(req, res) {
  const loginInstance = new LoginModel(req.body);

  try {
    console.log('[LOGIN] tentativa para:', req.body?.email);
    await loginInstance.login();

    if (loginInstance.errors.length > 0) {
      console.log('[LOGIN] falhou com erros:', loginInstance.errors);
      req.flash('errors', loginInstance.errors);
      return req.session.save(function saveSessionOnLoginError() {
        return res.redirect('/login/index');
      });
    }

    req.flash('success', 'Voce entrou no sistema');
    console.log('[LOGIN] sucesso para:', loginInstance.user?.email);
    req.session.usuario = loginInstance.user;

    return req.session.save(function saveSessionOnLoginSuccess() {
      return res.redirect('/');
    });
  } catch (e) {
    console.log(e);
    req.flash('errors', ['Erro ao processar o login']);
    return req.session.save(function saveSessionOnLoginException() {
      return res.redirect('/login/index');
    });
  }
};

exports.logout = function logout(req, res) {
  req.session.destroy(function destroySession() {
    return res.redirect('/login/index');
  });
};
