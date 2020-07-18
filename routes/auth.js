const express = require('express');
const routes = express.Router();
const authCtrl = require('./../controllers/authCtrl');
const authUsuario = require('./../libs/authUsuario');

routes.get('/', (req, res) => {
    return res.render('login');
});

routes.get('/logout', (req, res) => {
    return res.render('login');
});

routes.post('/auth_conductor', authCtrl.loginConductor);

routes.post('/auth_operador', authUsuario.authenticate('local', 'Operador'));

module.exports = routes;