const express = require('express');
const routes = express.Router();
const pedidoCtrl = require('../controllers/pedidoCtrl');

routes.get('/', pedidoCtrl.findAll);
routes.get('/mostrar/:pedido_id', pedidoCtrl.findOne);
routes.post('/eliminar/:pedido_id', pedidoCtrl.delete);

module.exports = routes;