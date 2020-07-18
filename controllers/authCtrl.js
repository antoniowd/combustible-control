const UsuarioModel = require('./../models/usuarioModel');
const MetaModel = require('./../models/metaModel');
const EstacionModel = require('./../models/estacionModel');
const VehiculoModel = require('./../models/vehiculoModel');
const config = require('./../config/config');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

exports.loginConductor = (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);
    let data = {};

    if (!username || !password)
        return res.status(400).json({message: 'BAD REQUEST'});


    UsuarioModel.findOne({username: username}, (err, user) => {
        if (err)
            return res.status(500).json({message: 'INTERNAL SERVER ERROR', error: err});

        if (!user || user.password !== password || user.role != 'Conductor' || user.status !== 1)
            return res.status(401).json({message: 'UNAUTHORIZED'});

        let counter = 3;
        VehiculoModel.find({status: 1}).exec((err, vehiculos) => {
            if (err) {
                return res.status(500).json({error: err});
            }

            data.vehiculos = vehiculos;
            done(--counter);
        });

        MetaModel.find({status: 1}).exec((err, metas) => {
            if (err) {
                return res.status(500).json({error: err});
            }

            data.metas = metas;
            done(--counter);
        });

        EstacionModel.find({status: 1}).exec((err, estaciones) => {
            if (err) {
                return res.status(500).json({error: err});
            }

            data.estaciones = estaciones;
            done(--counter);
        });


        let done = function (counter) {
            if (counter == 0) {
                const token = jwt.sign({id: user._id, role: user.role}, config.secret_key);
                data.token = token;
                return res.json(data);
            }
        }
    });

};
