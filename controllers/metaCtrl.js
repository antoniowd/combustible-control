const MetaModel = require('./../models/metaModel')
const PedidoModel = require('./../models/pedidoModel')
const config = require('./../config/config')
const url = require('./../helpers/url_helper')
const selection = require('./../helpers/selection_helper')
const date = require('date-and-time')

exports.findAll = (req, res) => {
  let data = {
    title: 'Listado de Metas'
  }

  MetaModel.find({}, (err, metas) => {
    if (err) {
      return res.render('404', {error: err})
    }

    data.metas = metas
    return res.render('meta/index', data)
  })
}

exports.create = (req, res) => {
  let data = {
    title: 'Nueva Meta',
    estados: selection.getEstados()
  }

  return res.render('meta/form', data)
}

exports.update = (req, res) => {
  let meta_id = req.params.meta_id
  let data = {
    title: 'Editar Meta',
    estados: selection.getEstados()
  }

  MetaModel.findOne({_id: meta_id}, (err, meta) => {
    if (err) {
      return res.render('404', {error: err})
    }
    data.meta = meta
    return res.render('meta/form', data)
  })

}

exports.save = (req, res) => {
  let meta_id = req.params.meta_id

  let meta = {
    codigo: req.body.codigo,
    descripcion: req.body.descripcion,
    updated: new Date(),
    status: req.body.status
  }

  let data = {
    title: 'Nueva Meta',
    meta: meta,
    estados: selection.getEstados()
  }

  if (meta_id == undefined) {
    meta.created = new Date()

    meta = new MetaModel(meta)

    meta.save((err) => {
      if (err) {
        return res.render('404', {error: err})
      }

      return res.redirect(url.siteUrl('metas'))
    })
  }
  else {
    MetaModel.findByIdAndUpdate(meta_id, meta, (err, met) => {
      if (err) {
        return res.render('404', {error: err})
      }

      return res.redirect(url.siteUrl('metas'))
    })
  }

}

exports.delete = async (req, res) => {
  let meta_id = req.params.meta_id

  try {
    let pedidos = await PedidoModel.count({meta: meta_id}).exec()
    if (pedidos > 0) {
      await MetaModel.findByIdAndUpdate({_id: meta_id}, {status: 0}).exec()
    }
    else {
      await MetaModel.findOneAndRemove({_id: meta_id}).exec()
    }
    return res.redirect(url.siteUrl('metas'))
  }
  catch (err) {
    return res.render('404', {error: err})
  }
}


