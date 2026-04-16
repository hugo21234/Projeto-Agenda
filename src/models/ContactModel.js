const mongoose = require('mongoose');
const validator = require('validator');


// Schema define o formato e as validacoes do documento na collection.
const ContactSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
});

// Model e a interface para consultar e manipular dados da collection Contact.
const ContactModel = mongoose.model('Contact', ContactSchema);

class Contact {
constructor(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
}

static async buscarPorId(id) {
    if(typeof id !== 'string') return null;
    valida()
    const contato = await ContactModel.findById(id);
    return contato;
}
static async buscarContatos() {
    const contatos = await ContactModel.find().sort({ createdAt: -1 });
    return contatos;
}
static async delete(id) {
 if(typeof id !== 'string') return null;
    valida()
    const contato = await ContactModel.findOneAndDelete({ _id: id });
    return contato;
}

async create() {
        this.valida();
        if (this.errors.length > 0) return;
        try {
            this.contato = await ContactModel.create(this.body);
        } catch (e) {
            console.log(e);
            this.errors.push('Erro ao criar contato');
        }
    }

    async delete(contactId) {
        try {
            await ContactModel.findByIdAndDelete(contactId);
        } catch (e) {
            console.log(e);
            throw new Error('Erro ao deletar contato');
        }
    }

    valida() {
        this.cleanUp();

        if (!this.body.email || !validator.isEmail(this.body.email)) {
            this.errors.push('Email invalido');
        }


    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email.trim().toLowerCase(),
            number: this.body.number,
            nome: this.body.nome,
        };
    }
}

Contact.edit = async function (id, body) {
    if(typeof id !== 'string') return null;
    this.body = body;
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await ContactModel.findByIdAndUpdate(id,this.body, { new: true });
    return this.contato;
    
}
module.exports.ContactModel = ContactModel;