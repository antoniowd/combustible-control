const PedidoModel = require('./../models/pedidoModel')
const VehiculoModel = require('./../models/vehiculoModel')
const UsuarioModel = require('./../models/usuarioModel')
const DeclaracionModel = require('./../models/declaracionModel')
const config = require('./../config/config')
const date = require('date-and-time')

exports.findAll = async (req, res) => {
  let data = {
    title: 'Listado de Pedidos de Combustible'
  }

  try {
    data.vehiculo_selected = req.query.vehiculo_id
    data.usuario_selected = req.query.usuario_id
    data.fecha_start = date.format(new Date(), '01/MM/YYYY')
    data.fecha_end = date.format(new Date(), 'DD/MM/YYYY')

    if (req.query.fecha) {
      var temp = req.query.fecha.split(' - ')
      data.fecha_start = temp[0]
      data.fecha_end = temp[1]
    }

    var filter = {}
    if (data.vehiculo_selected)
      filter.vehiculo = data.vehiculo_selected

    if (data.usuario_selected)
      filter.conductor = data.usuario_selected

    filter.fecha = {
      $gte: new Date(date.parse(data.fecha_start, 'DD/MM/YYYY')),
      $lte: new Date(date.parse(data.fecha_end + ' 23:59:29', 'DD/MM/YYYY HH:mm:ss')),
    }

    data.pedidos = await PedidoModel.find(filter).populate('vehiculo').populate('conductor').populate('meta').populate('estacion').exec()
    data.vehiculos = await VehiculoModel.find({}).exec()
    data.usuarios = await UsuarioModel.find({role: 'Conductor'}).exec()
    return res.render('pedido/index', data)
  } catch (err) {
    return res.render('404', {error: err})
  }
}

exports.findOne = (req, res) => {
  let pedido_id = req.params.pedido_id
  let data = {
    title: 'Detalles de la Nota de pedido',
    role: req.user.role
  }

  PedidoModel.findById(pedido_id).populate('vehiculo').populate('conductor').populate('meta').populate('estacion').exec((err, pedido) => {
    if (err) {
      return res.render('404', {error: err})
    }

    data.pedido = pedido
    DeclaracionModel.find({pedido: pedido_id}).exec((err, declaraciones) => {
      if (err) {
        return res.render('404', {error: err})
      }

      data.pedido.declaraciones = declaraciones

      data.pedido.total_declarado = 0
      for (var i = 0; i < data.pedido.declaraciones.length; i++)
        data.pedido.total_declarado += data.pedido.declaraciones[i].km_ciudad + data.pedido.declaraciones[i].km_carretera;

      return res.render('pedido/show', data)
    })

  })

}

exports.delete = async (req, res) => {
  let pedido_id = req.params.pedido_id

  try {
    if (req.user.role === 'Admin') {
      await DeclaracionModel.remove({pedido: pedido_id}).exec()
      await PedidoModel.findOneAndRemove({_id: pedido_id}).exec()
      return res.json({success: true})
    }
    else {
      return res.json({success: false})
    }

  }
  catch (err) {
    return res.status(404).json({error: err})
  }
}

