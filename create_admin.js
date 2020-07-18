const config = require('./config/config');
const mongoose = require('mongoose');
const md5 = require('md5');
const UsuarioModel = require('./models/usuarioModel');

mongoose.connect(config.db.host);

let usuario = {
    name: 'Administrador',
    username: 'admin',
    password: md5('admin'),
    role: 'Admin',
    updated: new Date(),
    created: new Date(),
    status: 1
};

usuario = new UsuarioModel(usuario);

usuario.save((err) => {
    if (err) {
        if (err.code == 11000) {
            UsuarioModel.findOneAndUpdate({username: 'admin'}, {$set: {'password': md5('admin'), role: 'Admin', status: 1}}, (err, usu) => {
                if (err) {
                    return console.log(err);
                }

                console.log('Administrador password reset');
                console.log('usuario: admin');
                console.log('password: admin');

                return;
            });
        } else {
            return console.log(err);
        }
    }
    else {
        console.log('Administrador Creado');
        console.log('usuario: admin');
        console.log('password: admin');

        return;
    }
});
