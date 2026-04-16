const { ContactModel } = require('../models/ContactModel');


// Controller responsavel por exibir a pagina de login.
exports.index = (req,res) => {
    res.render('CriaContato',{
        titulo: 'Criar contato',
        contato: null,
    })
}

exports.create = async function (req, res) {
    try {
        const contato = await ContactModel.create({
            nome: req.body.nome,
            email: req.body.email,
            number: req.body.number,
        });

        req.flash('success', 'Sucesso realizado com sucesso');
        req.session.save(function () {
            return res.redirect(`/contato/index/${contato._id}`);
        });
    } catch (e) {
        console.log(e);
        req.flash('errors', ['Erro ao processar o cadastro']);
        req.session.save(function () {
            return res.redirect('/criar-contato/index');
        });
    }
}

exports.delete = async function (req, res) {
    try {
        if(!req.params.id) return res.render('404');
        await ContactModel.findByIdAndDelete(req.params.id);
        req.flash('success', 'Contato deletado com sucesso');
        req.session.save(function () {
            return res.redirect('/');
        });
    } catch (e) {
        console.log(e);
        req.flash('errors', ['Erro ao deletar contato']);
        req.session.save(function () {
            return res.redirect('/');
        });
    }
}

exports.editindex = async function (req, res) {
    if(!req.params.id) return res.render('404')
        const contato = await ContactModel.findById(req.params.id);
    if(!contato) return res.render('404')
    res.render('CriaContato', {
        titulo: 'Editar contato',
        contato,
    })
}

exports.edit = async function (req, res) {
   try{ 
    if(!req.params.id) return res.render('404');

    const contato = await ContactModel.findByIdAndUpdate(
        req.params.id,
        {
            nome: req.body.nome,
            email: req.body.email,
            number: req.body.number,
        },
        { new: true, runValidators: true }
    );

      if (!contato) {
            req.flash('errors', ['Contato nao encontrado']);
            req.session.save(() => res.redirect('/'));
            return;
      }
        
        req.flash('success', 'Sucesso realizado com sucesso');
        req.session.save(function () {
            return res.redirect(`/contato/index/${contato._id}`);
        });
        
} catch (e) {
    console.log(e);
    req.flash('errors', ['Erro ao editar contato']);
    req.session.save(function () {
        return res.redirect('/criar-contato/index');
    });
 }
}
