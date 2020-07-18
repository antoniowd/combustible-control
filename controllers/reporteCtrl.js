const UsuarioModel = require('./../models/usuarioModel')
const MetaModel = require('./../models/metaModel')
const VehiculoModel = require('./../models/vehiculoModel')
const PedidoModel = require('./../models/pedidoModel')
const DeclaracionModel = require('./../models/declaracionModel')
const config = require('./../config/config')
const selection = require('./../helpers/selection_helper')
const date = require('date-and-time')

exports.consumo = async (req, res) => {
  let tipo_consumo = req.params.tipo_consumo
  let data = {}
  let vehiculos = null

  data.vehiculo_selected = req.query.vehiculo_id
  data.meta_selected = req.query.meta_id
  data.usuario_selected = req.query.usuario_id
  data.fecha_start = date.format(new Date(), '01/MM/YYYY')
  data.fecha_end = date.format(new Date(), 'DD/MM/YYYY')

  if (req.query.fecha) {
    var temp = req.query.fecha.split(' - ')
    data.fecha_start = temp[0]
    data.fecha_end = temp[1]
  }

  var filter = {}
  var pedidos_filter = {}
  if (data.vehiculo_selected)
    filter._id = data.vehiculo_selected

  pedidos_filter.fecha = {
    $gte: new Date(date.parse(data.fecha_start, 'DD/MM/YYYY')),
    $lte: new Date(date.parse(data.fecha_end + ' 23:59:29', 'DD/MM/YYYY HH:mm:ss'))
  }

  if (data.meta_selected)
    pedidos_filter.meta = data.meta_selected

  if (data.usuario_selected)
    pedidos_filter.conductor = data.usuario_selected

  console.log(pedidos_filter)

  try {
    vehiculos = await VehiculoModel.find(filter).populate({
      path: 'pedidos',
      match: pedidos_filter
    }).exec()

    data.metas = await MetaModel.find({}).exec()
    data.usuarios = await UsuarioModel.find({role: 'Conductor'}).exec()
  } catch (err) {
    return res.render('404', {error: err})
  }

  let results = []
  let total = {
    cantidad: 0,
    costo: 0,
  }
  for (let i = 0; i < vehiculos.length; i++) {
    if (selection.getTipoVehiculo(vehiculos[i].tipo_vehiculo).tipo_consumo != tipo_consumo)
      continue

    let temp = {
      _id: vehiculos[i]._id,
      matricula: vehiculos[i].matricula,
      tipo_vehiculo: vehiculos[i].tipo_vehiculo,
      km_inicial: vehiculos[i].pedidos[0] ? vehiculos[i].pedidos[0].km : 0,
      km_final: vehiculos[i].pedidos[0] ? vehiculos[i].pedidos[vehiculos[i].pedidos.length - 1].km : 0,
      km_ciudad: vehiculos[i].consumo_ciudad,
      km_carretera: vehiculos[i].consumo_carretera,
    }

    temp.km_recorrido = temp.km_final - temp.km_inicial

    temp.costo = 0
    temp.cantidad_recarga = 0
    temp.total_declarado = 0
    for (var j = 0; j < vehiculos[i].pedidos.length; j++) {
      let ped = vehiculos[i].pedidos[j]
      temp.costo += parseFloat(ped.precio * ped.cantidad)
      temp.cantidad_recarga += parseFloat(ped.cantidad)

      try {
        let declaraciones = await DeclaracionModel.find({pedido: ped._id}).exec()
        for (var k = 0; k < declaraciones.length; k++) {
          temp.total_declarado += parseFloat(declaraciones[k].km_ciudad + declaraciones[k].km_carretera)
        }
      }
      catch (err) {
        return res.render('404', {error: err})
      }
    }
    temp.costo = parseFloat(temp.costo)
    temp.cantidad_recarga = parseFloat(temp.cantidad_recarga)

    if (temp.cantidad_recarga == 0)
      continue

    results.push(temp)

    total.cantidad += parseFloat(temp.cantidad_recarga)
    total.costo += parseFloat(temp.costo)
  }

  data.vehiculos = results
  data.total = total

  data.tipo_consumo = tipo_consumo
  if (tipo_consumo == 'KM')
    return res.render('reporte/consumo_km', data)

  if (tipo_consumo == 'HORA')
    return res.render('reporte/consumo_hora', data)
}

exports.conductor = async (req, res) => {
  let data = {}
  let usuario_list = []
  let total = {
    cantidad: 0,
    costo: 0,
    total_pedidos: 0
  }

  data.vehiculo_selected = req.query.vehiculo_id
  data.meta_selected = req.query.meta_id
  data.usuario_selected = req.query.usuario_id
  data.fecha_start = date.format(new Date(), '01/MM/YYYY')
  data.fecha_end = date.format(new Date(), 'DD/MM/YYYY')

  if (req.query.fecha) {
    var temp = req.query.fecha.split(' - ')
    data.fecha_start = temp[0]
    data.fecha_end = temp[1]
  }

  var filter = {}
  var pedidos_filter = {}
  if (data.usuario_selected)
    filter._id = data.usuario_selected

  pedidos_filter.fecha = {
    $gte: new Date(date.parse(data.fecha_start, 'DD/MM/YYYY')),
    $lte: new Date(date.parse(data.fecha_end + ' 23:59:29', 'DD/MM/YYYY HH:mm:ss'))
  }

  if (data.vehiculo_selected)
    pedidos_filter.vehiculo = data.vehiculo_selected

  if (data.meta_selected)
    pedidos_filter.meta = data.meta_selected

  try {
    let usuarios = await UsuarioModel.find(filter).exec()
    for (let i = 0; i < usuarios.length; i++) {
      let temp = {
        name: usuarios[i].name,
        cantidad_recarga: 0,
        costo: 0,
        km_ciudad: 0,
        km_carretera: 0,
        horas: 0
      }

      pedidos_filter.conductor = usuarios[i]._id
      let pedidos = await PedidoModel
        .find(pedidos_filter)
        .populate('vehiculo')
        .populate('declaraciones')
        .exec()
      if (pedidos.length == 0)
        continue

      temp.cantidad_pedidos = pedidos.length
      for (let j = 0; j < pedidos.length; j++) {
        temp.cantidad_recarga += pedidos[j].cantidad
        temp.costo += parseFloat(pedidos[j].cantidad * pedidos[j].precio)

        if (selection.getTipoVehiculo(pedidos[j].vehiculo.tipo_vehiculo).tipo_consumo == 'KM') {
          for (let k = 0; k < pedidos[j].declaraciones.length; k++) {
            temp.km_ciudad += parseFloat(pedidos[j].declaraciones[k].km_ciudad)
            temp.km_carretera += parseFloat(pedidos[j].declaraciones[k].km_carretera)
          }
        }
        else if (selection.getTipoVehiculo(pedidos[j].vehiculo.tipo_vehiculo).tipo_consumo == 'HORA') {
          for (let k = 0; k < pedidos[j].declaraciones.length; k++) {
            temp.horas += parseFloat(pedidos[j].declaraciones[k].km_ciudad)
          }
        }
      }

      total.cantidad += parseFloat(temp.cantidad_recarga)
      total.costo += parseFloat(temp.costo)
      total.total_pedidos += parseFloat(temp.cantidad_pedidos)

      usuario_list.push(temp)
    }

    data.metas = await MetaModel.find({}).exec()
    data.usuarios = await UsuarioModel.find({role: 'Conductor'}).exec()
    data.vehiculos = await VehiculoModel.find({}).exec()
    data.usuario_list = usuario_list
    data.total = total

    return res.render('reporte/conductor', data)
  } catch (err) {
    return res.render('404', {error: err})
  }

}

//Reporte de metas
exports.meta = async (req, res) => {

  try {
    let data = await getMeta(req, res)
    return res.render('reporte/meta', data)
  } catch (err) {
    return res.render('404', {error: err})
  }

}

let getMeta = async (req, res) => {
  let data = {}
  let meta_list = []
  let total = {
    cantidad: 0,
    costo: 0,
    total_pedidos: 0
  }

  data.vehiculo_selected = req.query.vehiculo_id
  data.meta_selected = req.query.meta_id
  data.usuario_selected = req.query.usuario_id
  data.fecha_start = date.format(new Date(), '01/MM/YYYY')
  data.fecha_end = date.format(new Date(), 'DD/MM/YYYY')

  if (req.query.fecha) {
    var temp = req.query.fecha.split(' - ')
    data.fecha_start = temp[0]
    data.fecha_end = temp[1]
  }

  var filter = {}
  var pedidos_filter = {}
  if (data.meta_selected)
    filter._id = data.meta_selected

  pedidos_filter.fecha = {
    $gte: new Date(date.parse(data.fecha_start, 'DD/MM/YYYY')),
    $lte: new Date(date.parse(data.fecha_end + ' 23:59:29', 'DD/MM/YYYY HH:mm:ss'))
  }

  if (data.vehiculo_selected)
    pedidos_filter.vehiculo = data.vehiculo_selected

  if (data.usuario_selected)
    pedidos_filter.conductor = data.usuario_selected

  let metas = await MetaModel.find(filter).exec()
  for (let i = 0; i < metas.length; i++) {
    let temp = {
      codigo: metas[i].codigo,
      descripcion: metas[i].descripcion,
      cantidad_recarga: 0,
      costo: 0
    }

    pedidos_filter.meta = metas[i]._id
    let pedidos = await PedidoModel.find(pedidos_filter).exec()
    if (pedidos.length == 0)
      continue

    temp.cantidad_pedidos = pedidos.length
    for (let j = 0; j < pedidos.length; j++) {
      temp.cantidad_recarga += pedidos[j].cantidad
      temp.costo += parseFloat(pedidos[j].cantidad * pedidos[j].precio)
    }

    total.cantidad += parseFloat(temp.cantidad_recarga)
    total.costo += parseFloat(temp.costo)
    total.total_pedidos += parseFloat(temp.cantidad_pedidos)

    meta_list.push(temp)
  }

  data.metas = await MetaModel.find({}).exec()
  data.usuarios = await UsuarioModel.find({role: 'Conductor'}).exec()
  data.vehiculos = await VehiculoModel.find({}).exec()
  data.meta_list = meta_list
  data.total = total

  return data
}



