const mongoose = require('mongoose');

// delete mongoose.connection.models['Meta'];

let schema = new mongoose.Schema({
    codigo: {type: String, required: true, unique: true},
    descripcion: {type: String, required: true},
    updated: {type: Date, required: true},
    created: {type: Date, required: true},
    status: {type: Number, required: true}
});

module.exports = mongoose.model('Meta', schema);