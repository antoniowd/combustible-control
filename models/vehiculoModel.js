const mongoose = require('mongoose');

// delete mongoose.connection.models['Vehiculo'];

let schema = new mongoose.Schema({
    matricula: {type: String, required: true, unique: true},
    pedidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pedido' }],
    tipo_vehiculo: {type: Number, required: true},
    tipo_combustible: {type: Number, required: true},
    km: {type: Number, required: true},
    consumo_ciudad: {type: Number, required: true},
    consumo_carretera: {type: Number, required: true},
    fecha_soat: {type: Date, required: true},
    updated: {type: Date, required: true},
    created: {type: Date, required: true},
    status: {type: Number, required: true}
});

module.exports = mongoose.model('Vehiculo', schema);