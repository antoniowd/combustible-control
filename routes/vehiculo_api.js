const express = require('express');
const routes = express.Router();
const vehiculoApi = require('../controllers/vehiculoApi');

routes.get('/', vehiculoApi.findAll);
routes.get('/:vehiculo_id', vehiculoApi.findOne);

module.exports = routes;