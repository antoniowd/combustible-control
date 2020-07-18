const mongoose = require('mongoose');

// delete mongoose.connection.models['Declaracion'];

let schema = new mongoose.Schema({
    fecha: {type: Date, required: true},
    pedido: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true },
    km_ciudad: {type: Number, required: true},
    km_carretera: {type: Number, required: true},
    updated: {type: Date, required: true},
    created: {type: Date, required: true},
    status: {type: Number, required: true}
});

module.exports = mongoose.model('Declaracion', schema);