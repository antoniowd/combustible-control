const express = require('express');
const routes = express.Router();
const reporteCtrl = require('../controllers/reporteCtrl');

routes.get('/consumo/:tipo_consumo', reporteCtrl.consumo);
routes.get('/conductor', reporteCtrl.conductor);
routes.get('/meta', reporteCtrl.meta);

module.exports = routes;