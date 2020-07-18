const DeclaracionModel = require('./../models/declaracionModel')
const PedidoModel = require('./../models/pedidoModel')
const selection = require('./../helpers/selection_helper')

exports.findAllByPedido = (req, res) => {
  let pedido_id = req.params.pedido_id
  let data = {}

  DeclaracionModel.find({pedido: pedido_id}).populate('pedido').exec((err, declaraciones) => {
    if (err) {
      return res.status(500).json({error: err})
    }

    data.declaraciones = declaraciones

    data.total_declarado = 0
    for (var i = 0; i < data.declaraciones.length; i++)
      data.total_declarado += data.declaraciones[i].km_ciudad + data.declaraciones[i].km_carretera;
    return res.status(200).json(data)
  })
}

exports.findOne = (req, res) => {
  let declaracion_id = req.params.declaracion_id

  DeclaracionModel.findById(declaracion_id).populate('pedido').exec((err, declaracion) => {
    if (err) {
      return res.status(500).json({error: err})
    }

    return res.status(200).json({declaracion: declaracion})
  })
}

exports.save = (req, res) => {
  let declaracion_id = req.params.declaracion_id

  let declaracion = {
    pedido: req.body.pedido,
    km_ciudad: req.body.km_ciudad,
    km_carretera: req.body.km_carretera,
    updated: new Date(),
    status: 1
  }

  PedidoModel.findById(declaracion.pedido).populate('vehiculo').exec((err, pedido) => {
    if (err) {
      return res.status(500).json({error: err})
    }
    let tipo_vehiculo = selection.getTipoVehiculo(pedido.vehiculo.tipo_vehiculo)
    if (tipo_vehiculo.tipo_consumo == 'HORA')
      declaracion.km_carretera = 0

    let data = {
      declaracion: declaracion,
    }

    if (declaracion_id == undefined) {
      declaracion.created = new Date()
      declaracion.fecha = new Date()

      declaracion = new DeclaracionModel(declaracion)

      declaracion.save((err, dec) => {
        if (err) {
          data.error = err
          return res.status(500).json(data)
        }

        data.declaracion = dec
        PedidoModel.findByIdAndUpdate(declaracion.pedido, {$push: {declaraciones: dec._id}}, (err, ped) => {
          if (err) {
            data.error = err
            return res.status(500).json(data)
          }
          return res.status(200).json(data)
        })
      })
    }
    else {
      DeclaracionModel.findByIdAndUpdate(declaracion_id, declaracion, {'new': true}, (err, dec) => {
        if (err) {
          data.error = err
          return res.status(500).json(data)
        }
        data.declaracion = dec
        return res.status(200).json(data)
      })
    }
  })

}

exports.delete = async (req, res) => {
  let declaracion_id = req.params.declaracion_id

  try {
    let doc = await DeclaracionModel.findByIdAndRemove(declaracion_id).exec()
    let pedido = await PedidoModel.findOneAndUpdate(
      {},
      {$pull: {declaraciones: {$in: [declaracion_id]}}},
      {multi: true}
    )

    return res.json({declaracion_id: declaracion_id})
  } catch (err) {
    return res.status(500).json({error: err})
  }
}


