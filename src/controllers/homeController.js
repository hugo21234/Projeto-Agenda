/**
 * Controller da home.
 *
 * Papel no sistema:
 * - Receber requisição da rota `/` e renderizar páginas públicas.
 *
 * Conexão com outros arquivos:
 * - Usa `HomeModel` para operações com dados da home.
 * - Renderiza `views/index.ejs` e `views/sobre.ejs`.
 */
const HomeModel = require('../models/HomeModel');

/**
 * Side-effect didático: cria documento ao carregar módulo.
 *
 * ⚠️ Atenção:
 * - Em produção, esse padrão não é recomendado porque executa em todo boot.
 * - Melhor mover para script de seed controlado.
 */
HomeModel.create({
  titulo: 'Título de exemplo',
  descricao: 'Descrição de exemplo',
})
  .then((dados) => console.log(dados))
  .catch((err) => console.error('Erro ao criar documento:', err));

/**
 * Renderiza a página inicial.
 *
 * @route GET /
 * @param {import('express').Request} req - Requisição HTTP atual.
 * @param {import('express').Response} res - Resposta HTTP.
 * @returns {void}
 *
 * Por que existe:
 * - Oferecer um endpoint inicial para validar fluxo de sessão e renderização.
 */
exports.index = (req, res) => {
  console.log(req.session.usuario);
  res.render('index', {
    titulo: 'Modelo Express',
    descricao:
      'Projeto com Express Router, Controllers, Views, arquivos estaticos e Middlewares em pastas separadas.',
  });
};

/**
 * Renderiza a página "sobre" do projeto.
 *
 * @route GET /sobre
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
exports.sobre = (req, res) => {
  res.render('sobre', {
    titulo: 'Sobre o Projeto',
  });
};
