const selection = require('./../config/selection');

exports.getTipoVehiculo = (id = false) => {
    if (id === false)
        return selection.tipo_vehiculos;
    else {
        for (var i = 0; i < selection.tipo_vehiculos.length; i++) {
            if (selection.tipo_vehiculos[i].id == id)
                return selection.tipo_vehiculos[i];
        }
    }
};

exports.getTipoCombustible = (id = false) => {
    if (id === false)
        return selection.tipo_combustible;
    else {
        for (var i = 0; i < selection.tipo_combustible.length; i++) {
            if (selection.tipo_combustible[i].id == id)
                return selection.tipo_combustible[i];
        }
    }
};

exports.getEstados = (id = false) => {
    if (id === false )
        return selection.estado;
    else {
        for (var i = 0; i < selection.estado.length; i++) {
            if (selection.estado[i].id === id)
                return selection.estado[i];
        }
    }
};

exports.getRoles = () => {
    return selection.roles;
};