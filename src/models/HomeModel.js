const { ContactModel } = require('./ContactModel');

class HomeModel {
  static async buscaContatos() {
    return ContactModel.find().sort({ _id: -1 }); // mais novos primeiro
  }
}

module.exports = HomeModel;
