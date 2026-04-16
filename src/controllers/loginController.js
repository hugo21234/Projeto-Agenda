const LoginModel = require('../models/LoginModel');

// Controller responsavel por exibir a pagina de login.
exports.index = (req,res) => {
    res.render('login',{
        titulo: 'Login'
    })
}

exports.register = async function (req, res) {
    try {
        const login = new LoginModel(req.body);
        await login.register();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(function () {
                return res.redirect('/login/index');
            });
            return;
        }

        req.flash('success', 'Sucesso realizado com sucesso');
        req.session.usuario = login.user;
        req.session.save(function () {
            return res.redirect('/');
        });
    } catch (e) {
        console.log(e);
        req.flash('errors', ['Erro ao processar o cadastro']);
        req.session.save(function () {
            return res.redirect('/login/index');
        });
    }
}

exports.login = async function (req, res) {
   const login = new LoginModel(req.body); 
    try {
        console.log('[LOGIN] tentativa para:', req.body?.email);
        await login.login();

        if (login.errors.length > 0) {
            console.log('[LOGIN] falhou com erros:', login.errors);
            req.flash('errors', login.errors);
            req.session.save(function () {
                return res.redirect('/login/index');
            });
            return;
        }

        req.flash('success', 'Voce entrou no sistema');
        console.log('[LOGIN] sucesso para:', login.user?.email);
        req.session.usuario = login.user;
        req.session.save(function () {
            return res.redirect('/');
        });
    } catch (e) {
        console.log(e);
        req.flash('errors', ['Erro ao processar o login']);
        req.session.save(function () {
            return res.redirect('/login/index');
        });
    }
}

exports.logout = function (req, res) {
    req.session.destroy(function () {
        return res.redirect('/login/index');
    });
}