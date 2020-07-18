const EstacionModel = require('./../models/estacionModel')
const PedidoModel = require('./../models/pedidoModel')
const config = require('./../config/config')
const url = require('./../helpers/url_helper')
const selection = require('./../helpers/selection_helper')
const date = require('date-and-time')

exports.findAll = (req, res) => {
  let data = {
    title: 'Listado de Estaciones'
  }

  EstacionModel.find({}, (err, estaciones) => {
    if (err) {
      return res.render('404', {error: err})
    }

    data.estaciones = estaciones
    return res.render('estacion/index', data)
  })
}

exports.create = (req, res) => {
  let data = {
    title: 'Nueva Estación',
    estados: selection.getEstados()
  }

  return res.render('estacion/form', data)
}

exports.update = (req, res) => {
  let estacion_id = req.params.estacion_id
  let data = {
    title: 'Editar Estación',
    estados: selection.getEstados()
  }

  EstacionModel.findOne({_id: estacion_id}, (err, estacion) => {
    if (err) {
      return res.render('404', {error: err})
    }
    data.estacion = estacion
    return res.render('estacion/form', data)
  })

}

exports.save = (req, res) => {
  let estacion_id = req.params.estacion_id
  console.log(req.body)
  let estacion = {
    nombre: req.body.nombre,
    updated: new Date(),
    status: req.body.status
  }

  if (req.body.lat !== undefined && req.body.lng !== undefined) {
    estacion.coords = [req.body.lat, req.body.lng]
    estacion.dir = req.body.dir
  }

  let data = {
    title: 'Nueva Estación',
    estacion: estacion,
    estados: selection.getEstados()
  }

  if (estacion_id == undefined) {
    estacion.created = new Date()

    estacion = new EstacionModel(estacion)

    estacion.save((err) => {
      if (err) {
        return res.render('404', {error: err})
      }

      return res.redirect(url.siteUrl('estaciones'))
    })
  }
  else {
    EstacionModel.findByIdAndUpdate(estacion_id, estacion, (err, est) => {
      if (err) {
        return res.render('404', {error: err})
      }

      return res.redirect(url.siteUrl('estaciones'))
    })
  }

}

exports.delete = async (req, res) => {
  let estacion_id = req.params.estacion_id

  try {
    let pedidos = await PedidoModel.count({estacion: estacion_id}).exec()
    if (pedidos > 0) {
      await EstacionModel.findByIdAndUpdate({_id: estacion_id}, {status: 0}).exec()
    }
    else {
      await EstacionModel.findOneAndRemove({_id: estacion_id}).exec()
    }
    return res.redirect(url.siteUrl('estaciones'))
  }
  catch (err) {
    return res.render('404', {error: err})
  }
}


