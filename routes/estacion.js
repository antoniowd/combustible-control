const express = require('express');
const routes = express.Router();
const estacionCtrl = require('../controllers/estacionCtrl');

routes.get('/', estacionCtrl.findAll);
routes.get('/nuevo', estacionCtrl.create);
routes.get('/editar/:estacion_id', estacionCtrl.update);

routes.post('/guardar', estacionCtrl.save);
routes.post('/guardar/:estacion_id', estacionCtrl.save);

routes.get('/eliminar/:estacion_id', estacionCtrl.delete);

module.exports = routes;