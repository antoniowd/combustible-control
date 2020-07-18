const VehiculoModel = require('./../models/vehiculoModel');

exports.findAll = (req, res) => {
    let data = {};

    VehiculoModel.find({status: 1}).exec((err, vehiculos) => {
        if (err) {
            return res.status(500).json({error: err});
        }

        data.vehiculos = vehiculos;
        return res.status(200).json(data);
    });
};


exports.findOne = (req, res) => {
    let vehiculo_id = req.params.vehiculo_id;

    VehiculoModel.findById(vehiculo_id).exec((err, vehiculo) => {
        if (err) {
            return res.status(500).json({error: err});
        }

        return res.status(200).json({vehiculo: vehiculo});
    });
};


