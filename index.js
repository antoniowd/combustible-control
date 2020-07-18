const express = require("express");
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const setRoutes = require('./routes/all');
const config = require('./config/config');
const authUsuario = require('./libs/authUsuario');

mongoose.connect(config.db.host);

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(morgan('dev'));
app.use(config.site_url, express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

const cookieExpirationDate = new Date();
const cookieExpirationDays = 365;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

app.use(session({
    secret: config.secret_key,
    name: 'combustible_cookie',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: cookieExpirationDate // use expires instead of maxAge
    }
}));

app.use(authUsuario.init());
app.use(authUsuario.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req, res, next){
    app.locals.user_name = req.user != undefined ? req.user.username : '';
    next();
});

app.locals.date = require('date-and-time');
app.locals.siteUrl = require('./helpers/url_helper').siteUrl;
app.locals.selection = require('./helpers/selection_helper');

setRoutes(app);

app.listen(8080, () => {
    console.log('Started on port 8080');
});