const config = require('./../config/config');
const url = require('./../helpers/url_helper');
const passport = require('passport');
const JwtBearerStrategy = require('passport-http-jwt-bearer').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const _ = require('underscore');
const md5 = require('md5');

const UsuarioModel = require('./../models/usuarioModel');

passport.use(new JwtBearerStrategy(config.secret_key, function (payload, done) {
    UsuarioModel.findById(payload.id, (err, user) => {
        if (err) {
            return done(err, false);
        }

        if (user) {
            return done(null, {id: user._id, role: user.role}, payload);
        }
        else {
            return done(null, false);
        }
    });
}));

passport.use(new LocalStrategy(
    function (username, password, done) {
        UsuarioModel.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (!user || user.password !== md5(password) || (user.role !== 'Operador' && user.role !== 'Admin') || user.status !== 1) {
                return done(null, false);
            }

            return done(null, {id: user._id, role: user.role});
        });
    }
));

passport.serializeUser(function (user, done) {
    return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    UsuarioModel.findById(id, function (err, user) {
        return done(err, user);
    });
});

exports.init = () => {
    return passport.initialize();
};

exports.session = () => {
    return passport.session();
};

exports.authenticate = (strategy, ...roles) => {
    return (req, res, next) => {
        if (strategy == 'jwt-bearer') {
            passport.authenticate('jwt-bearer', {session: false}, (err, user, info) => {
                req.user = info;
                if (err) {
                    return res.status(400).json({error: err});
                }

                if (_.indexOf(roles, user.role) === -1) {
                    return res.status(401).json({user: user});
                }
                else
                    next();
            })(req, res, next);
        }
        else if (strategy == 'local') {

            passport.authenticate('local',
                {
                    failureRedirect: url.siteUrl('login'),
                    successRedirect: url.siteUrl()
                })(req, res, next);
        }

    }
};


exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.redirect(url.siteUrl('login'));
};

