const express = require('express');
const routes = express.Router();
const declaracionApi = require('../controllers/declaracionApi');

routes.get('/pedido/:pedido_id', declaracionApi.findAllByPedido);
routes.get('/:declaracion_id', declaracionApi.findOne);
routes.post('/', declaracionApi.save);
routes.put('/:declaracion_id', declaracionApi.save);
routes.delete('/:declaracion_id', declaracionApi.delete);

module.exports = routes;