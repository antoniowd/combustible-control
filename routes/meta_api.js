const express = require('express');
const routes = express.Router();
const metaApi = require('../controllers/metaApi');

routes.get('/', metaApi.findAll);
routes.get('/:meta_id', metaApi.findOne);

module.exports = routes;