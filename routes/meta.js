const express = require('express');
const routes = express.Router();
const metaCtrl = require('../controllers/metaCtrl');

routes.get('/', metaCtrl.findAll);
routes.get('/nuevo', metaCtrl.create);
routes.get('/editar/:meta_id', metaCtrl.update);

routes.post('/guardar', metaCtrl.save);
routes.post('/guardar/:meta_id', metaCtrl.save);

routes.get('/eliminar/:meta_id', metaCtrl.delete);

module.exports = routes;