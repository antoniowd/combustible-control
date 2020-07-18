const express = require('express');
const routes = express.Router();
const url = require('./../helpers/url_helper');

routes.get('/', (req, res) => {
	return res.render('home/index', {title: 'Control de Combustible'});
});


module.exports = routes;
