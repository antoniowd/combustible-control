const mongoose = require('mongoose');

// delete mongoose.connection.models['Usuario'];

let schema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    updated: {type: Date, required: true},
    created: {type: Date, required: true},
    status: {type: Number, required: true}
});

module.exports = mongoose.model('Usuario', schema);