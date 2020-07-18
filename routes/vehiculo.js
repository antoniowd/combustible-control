const express = require('express');
const routes = express.Router();
const vehiculoCtrl = require('../controllers/vehiculoCtrl');

routes.get('/', vehiculoCtrl.findAll);
routes.get('/nuevo', vehiculoCtrl.create);
routes.get('/editar/:vehiculo_id', vehiculoCtrl.update);

routes.post('/guardar', vehiculoCtrl.save);
routes.post('/guardar/:vehiculo_id', vehiculoCtrl.save);

routes.get('/eliminar/:vehiculo_id', vehiculoCtrl.delete);

module.exports = routes;