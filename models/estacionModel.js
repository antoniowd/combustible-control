const mongoose = require('mongoose');

delete mongoose.connection.models['Estacion'];

let schema = new mongoose.Schema({
    nombre: {type: String, required: true, unique: true},
    coords: {type: [Number], index: '2dsphere'},
    dir: {type: String},
    updated: {type: Date, required: true},
    created: {type: Date, required: true},
    status: {type: Number, required: true}
});

module.exports = mongoose.model('Estacion', schema);