const express = require('express');
const routes = express.Router();
const pedidoApi = require('../controllers/pedidoApi');

routes.get('/', pedidoApi.findAll);
routes.get('/:pedido_id', pedidoApi.findOne);
routes.post('/', pedidoApi.save);
routes.put('/:pedido_id', pedidoApi.save);
routes.delete('/:pedido_id', pedidoApi.delete);

module.exports = routes;