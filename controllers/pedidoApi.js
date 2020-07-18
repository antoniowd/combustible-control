const PedidoModel = require('./../models/pedidoModel')
const VehiculoModel = require('./../models/vehiculoModel')
const DeclaracionModel = require('./../models/declaracionModel')
const date = require('date-and-time')
const path = require('path')
const _ = require('underscore')

exports.findAll = async (req, res) => {
  let data = {}

  try {
    data.mes = req.query.mes
    data.year = req.query.year
    data.fecha_start = date.format(new Date(), '01/MM/YYYY')
    data.fecha_end = date.format(new Date(), 'DD/MM/YYYY')

    if (data.mes && data.year) {
      data.fecha_start = date.format(new Date(data.year, parseInt(data.mes - 1), 1), 'DD/MM/YYYY')
      data.fecha_end = date.format(new Date(data.year, parseInt(data.mes), -0), 'DD/MM/YYYY')
    }

    var filter = {}
    filter.conductor = req.user.id
    filter.fecha = {
      $gte: new Date(date.parse(data.fecha_start, 'DD/MM/YYYY')),
      $lte: new Date(date.parse(data.fecha_end + ' 23:59:29', 'DD/MM/YYYY HH:mm:ss'))
    }

    data.pedidos = await PedidoModel.find(filter)
      .populate('vehiculo')
      .populate('conductor')
      .populate('meta')
      .populate('estacion')
      .exec()

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({error: err})
  }
}

exports.findOne = (req, res) => {
  let pedido_id = req.params.pedido_id
  let data = {}

  PedidoModel.findById(pedido_id).populate('vehiculo').populate('conductor').populate('meta').populate('estacion').exec((err, pedido) => {
    if (err) {
      return res.status(500).json({error: err})
    }

    data.pedido = pedido
    DeclaracionModel.find({pedido: pedido_id}).exec((err, declaraciones) => {
      if (err) {
        return res.status(500).json({error: err})
      }

      data.declaraciones = declaraciones

      data.total_declarado = 0
      for (var i = 0; i < data.declaraciones.length; i++)
        data.total_declarado += data.declaraciones[i].km_ciudad + data.declaraciones[i].km_carretera;

      return res.status(200).json(data)
    })

  })
}

exports.save = (req, res) => {
  let pedido_id = req.params.pedido_id

  let pedido = {
    numero: req.body.numero,
    vehiculo: req.body.vehiculo,
    conductor: req.user.id,
    meta: req.body.meta,
    estacion: req.body.estacion,
    km: req.body.km,
    cantidad: req.body.cantidad,
    precio: req.body.precio,
    odometro_base64: req.body.odometro_base64,
    nota_pedido_base64: req.body.nota_pedido_base64,
    updated: new Date(),
    status: 1
  }

  let data = {
    pedido: pedido,
  }

  if (pedido_id == undefined) {
    pedido.created = new Date()
    pedido.fecha = new Date()

    pedido = new PedidoModel(pedido)

    pedido.save((err, ped) => {
      if (err) {
        data.error = err
        return res.status(500).json(data)
      }

      data.pedido = ped

      //Actualizo las relacion en vehiculos
      VehiculoModel.findByIdAndUpdate(pedido.vehiculo, {$push: {pedidos: ped._id}}, (err, veh) => {
        if (err) {
          data.error = err
          return res.status(500).json(data)
        }

        return res.status(200).json(data)

      })

    })
  }
  else {
    let pedido_edit = _.pick(pedido, function (value, key, object) {
      return value != undefined
    })

    PedidoModel.findByIdAndUpdate(pedido_id, pedido_edit, {'new': true}, (err, ped) => {
      if (err) {
        data.error = err
        return res.status(500).json(data)
      }
      data.pedido = ped
      return res.status(200).json(data)
    })
  }

}

exports.delete = (req, res) => {
  let pedido_id = req.params.pedido_id

  return res.status(400).json({pedido_id: pedido_id})
}


