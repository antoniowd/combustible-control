const VehiculoModel = require('./../models/vehiculoModel')
const PedidoModel = require('./../models/pedidoModel')
const config = require('./../config/config')
const url = require('./../helpers/url_helper')
const selection = require('./../helpers/selection_helper')
const date = require('date-and-time')

exports.findAll = (req, res) => {
  let data = {
    title: 'Listado de Vehiculos'
  }

  VehiculoModel.find({}, (err, vehiculos) => {
    if (err) {
      return res.render('404', {error: err})
    }

    data.vehiculos = vehiculos
    return res.render('vehiculo/index', data)
  })
}

exports.create = (req, res) => {
  let data = {
    title: 'Nuevo Vehiculos',
    tipo_vehiculos: selection.getTipoVehiculo(),
    tipo_combustibles: selection.getTipoCombustible(),
    estados: selection.getEstados()
  }

  return res.render('vehiculo/form', data)
}

exports.update = (req, res) => {
  let vehiculo_id = req.params.vehiculo_id
  let data = {
    title: 'Editar Vehiculo',
    tipo_vehiculos: selection.getTipoVehiculo(),
    tipo_combustibles: selection.getTipoCombustible(),
    estados: selection.getEstados()
  }

  VehiculoModel.findOne({_id: vehiculo_id}, (err, vehiculo) => {
    if (err) {
      return res.render('404', {error: err})
    }
    data.vehiculo = vehiculo
    return res.render('vehiculo/form', data)
  })

}

exports.save = (req, res) => {
  let vehiculo_id = req.params.vehiculo_id

  let vehiculo = {
    matricula: req.body.matricula,
    tipo_vehiculo: req.body.tipo_vehiculo,
    tipo_combustible: req.body.tipo_combustible,
    km: req.body.km,
    consumo_ciudad: req.body.consumo_ciudad,
    consumo_carretera: req.body.consumo_carretera,
    fecha_soat: new Date(date.parse(req.body.fecha_soat, 'DD/MM/YYYY')),
    updated: new Date(),
    status: req.body.status
  }

  let data = {
    title: 'Nuevo Vehiculo',
    vehiculo: vehiculo,
    tipo_vehiculos: selection.getTipoVehiculo(),
    tipo_combustibles: selection.getTipoCombustible(),
    estados: selection.getEstados()
  }

  for (var i = 0; i < data.tipo_vehiculos.length; i++)
    if (data.tipo_vehiculos[i].id == vehiculo.tipo_vehiculo && data.tipo_vehiculos[i].tipo_consumo == 'HORA')
      vehiculo.consumo_carretera = 0

  if (vehiculo_id == undefined) {
    vehiculo.created = new Date()

    vehiculo = new VehiculoModel(vehiculo)

    vehiculo.save((err) => {
      if (err) {
        return res.render('404', {error: err})
      }

      return res.redirect(url.siteUrl('vehiculos'))
    })
  }
  else {
    VehiculoModel.findByIdAndUpdate(vehiculo_id, vehiculo, (err, veh) => {
      if (err) {
        return res.render('404', {error: err})
      }

      return res.redirect(url.siteUrl('vehiculos'))
    })
  }

}

exports.delete = async (req, res) => {
  let vehiculo_id = req.params.vehiculo_id

  try {
    let pedidos = await PedidoModel.count({vehiculo: vehiculo_id}).exec()
    if (pedidos > 0) {
      await VehiculoModel.findByIdAndUpdate({_id: vehiculo_id}, {status: 0}).exec()
    }
    else {
      await VehiculoModel.findOneAndRemove({_id: vehiculo_id}).exec()
    }
    return res.redirect(url.siteUrl('vehiculos'))
  }
  catch (err) {
    return res.render('404', {error: err})
  }
}


