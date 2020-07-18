const mongoose = require('mongoose');

// delete mongoose.connection.models['Pedido'];

let schema = new mongoose.Schema({
    numero: {type: String, required: true, unique: true},
    fecha: {type: Date, required: true},
    declaraciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Declaracion' }],
    vehiculo: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehiculo', required: true },
    conductor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    meta: { type: mongoose.Schema.Types.ObjectId, ref: 'Meta', required: true },
    estacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Estacion', required: true },
    km: {type: Number, required: true},
    cantidad: {type: Number, required: true},
    precio: {type: Number, required: true},
    odometro_base64: {type: String, required: false},
    nota_pedido_base64: {type: String, required: false},
    updated: {type: Date, required: true},
    created: {type: Date, required: true},
    status: {type: Number, required: true}
});

module.exports = mongoose.model('Pedido', schema);