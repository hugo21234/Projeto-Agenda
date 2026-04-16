/**
 * Model de autenticação de usuário.
 *
 * Papel no sistema:
 * - Definir schema MongoDB para login.
 * - Encapsular regras de validação e autenticação.
 *
 * Conexão com outros arquivos:
 * - É usado por `loginController` para cadastro/login.
 */
const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

/**
 * Schema da coleção `Login`.
 * 🧠 Aprendizado: schema impõe contrato mínimo para persistência.
 */
const LoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

/**
 * Interface Mongoose para CRUD da coleção.
 */
const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  /**
   * @param {{email?: string, password?: string}} body - Payload recebido do formulário.
   */
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  /**
   * Autentica usuário por email e senha.
   *
   * Quando é chamada:
   * - No fluxo `POST /login/login`.
   */
  async login() {
    this.valida();
    if (this.errors.length > 0) return;

    this.user = await LoginModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push('Usuario nao encontrado');
      return;
    }

    if (this.user && !bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha invalida');
      this.user = null;
    }
  }

  /**
   * Registra novo usuário com senha criptografada.
   *
   * Por que existe:
   * - Centralizar regra de negócio de cadastro em um único ponto.
   */
  async register() {
    this.valida();
    if (this.errors.length > 0) return;

    await this.userExists();
    if (this.errors.length > 0) return;

    try {
      const salt = bcryptjs.genSaltSync();
      this.body.password = bcryptjs.hashSync(this.body.password, salt);
      this.user = await LoginModel.create(this.body);
    } catch (e) {
      console.log(e);
      this.errors.push('Erro ao cadastrar o usuario');
    }
  }

  /**
   * Verifica se já existe usuário com o mesmo email.
   */
  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push('Usuario ja existe');
  }

  /**
   * Executa validações de negócio do payload.
   *
   * ⚠️ Atenção:
   * - Esta regra define senha mínima de 3, mas em produção recomenda-se mínimo maior.
   */
  valida() {
    this.cleanUp();

    if (!this.body.email || !validator.isEmail(this.body.email)) {
      this.errors.push('Email invalido');
    }

    if (!this.body.password || this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisa conter entre 3 e 50 caracteres');
    }
  }

  /**
   * Normaliza entrada para reduzir riscos de tipo inesperado.
   *
   * Por que existe:
   * - Evitar quebrar validações quando body contém tipos não string.
   */
  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email.trim().toLowerCase(),
      password: this.body.password,
    };
  }
}

module.exports = Login;
