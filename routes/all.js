const url = require('./../helpers/url_helper');
const authUsuario = require('./../libs/authUsuario');

module.exports = function (app) {

    //WEB ROUTES
    app.use(url.siteUrl('login'), require('./auth'));

    app.get(url.siteUrl('logout'), (req, res) => {
        req.logout();
        res.redirect('login');
    });

    app.use(url.siteUrl('vehiculos'), authUsuario.isLoggedIn, require('./vehiculo'));
    app.use(url.siteUrl('usuarios'), authUsuario.isLoggedIn, require('./usuario'));
    app.use(url.siteUrl('metas'), authUsuario.isLoggedIn, require('./meta'));
    app.use(url.siteUrl('estaciones'), authUsuario.isLoggedIn, require('./estacion'));
    app.use(url.siteUrl('pedidos'), authUsuario.isLoggedIn, require('./pedido'));
    app.use(url.siteUrl('reportes'), authUsuario.isLoggedIn, require('./reporte'));

    //API ROUTES
    app.use(url.siteUrl('api/pedidos'), authUsuario.authenticate('jwt-bearer', 'Conductor'), require('./pedido_api'));
    app.use(url.siteUrl('api/declaraciones'), authUsuario.authenticate('jwt-bearer', 'Conductor'), require('./declaracion_api'));
    app.use(url.siteUrl('api/vehiculos'), authUsuario.authenticate('jwt-bearer', 'Conductor'), require('./vehiculo_api'));
    app.use(url.siteUrl('api/metas'), authUsuario.authenticate('jwt-bearer', 'Conductor'), require('./meta_api'));


    //Este es el home path y tiene que estar de ultimo
    app.use(url.siteUrl(), authUsuario.isLoggedIn, require('./index'));
};
