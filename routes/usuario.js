const express = require('express');
const routes = express.Router();
const usuarioCtrl = require('../controllers/usuarioCtrl');

routes.get('/', usuarioCtrl.findAll);
routes.get('/nuevo', usuarioCtrl.create);
routes.get('/editar/:usuario_id', usuarioCtrl.update);

routes.post('/guardar', usuarioCtrl.save);
routes.post('/guardar/:usuario_id', usuarioCtrl.save);

routes.get('/eliminar/:usuario_id', usuarioCtrl.delete);

module.exports = routes;