const UsuarioModel = require('./../models/usuarioModel')
const PedidoModel = require('./../models/pedidoModel')
const config = require('./../config/config')
const url = require('./../helpers/url_helper')
const selection = require('./../helpers/selection_helper')
const date = require('date-and-time')
const md5 = require('md5')

exports.findAll = (req, res) => {
  let data = {
    title: 'Listado de Usuarios'
  }

  UsuarioModel.find({}, (err, usuarios) => {
    if (err) {
      return res.render('404', {error: err})
    }

    data.usuarios = usuarios
    return res.render('usuario/index', data)
  })
}

exports.create = (req, res) => {
  let data = {
    title: 'Nuevo Usuario',
    roles: selection.getRoles(),
    estados: selection.getEstados()
  }

  return res.render('usuario/form', data)
}

exports.update = (req, res) => {
  let usuario_id = req.params.usuario_id
  let data = {
    title: 'Editar Usuario',
    roles: selection.getRoles(),
    estados: selection.getEstados()
  }

  UsuarioModel.findOne({_id: usuario_id}, (err, usuario) => {
    if (err) {
      return res.render('404', {error: err})
    }
    data.usuario = usuario
    return res.render('usuario/form', data)
  })

}

exports.save = (req, res) => {
  let usuario_id = req.params.usuario_id

  let usuario = {
    name: req.body.name,
    username: req.body.username,
    password: md5(req.body.password),
    role: req.body.username != 'admin' ? req.body.role : 'Admin',
    updated: new Date(),
    status: req.body.username != 'admin' ? req.body.status : 1
  }

  let data = {
    title: 'Nuevo Usuario',
    usuario: usuario,
    roles: selection.getRoles(),
    estados: selection.getEstados()
  }

  if (usuario_id == undefined) {
    usuario.created = new Date()

    usuario = new UsuarioModel(usuario)

    usuario.save((err) => {
      if (err) {
        return res.render('404', {error: err})
      }

      return res.redirect(url.siteUrl('usuarios'))
    })
  }
  else {
    UsuarioModel.findByIdAndUpdate(usuario_id, usuario, (err, usu) => {
      if (err) {
        data.error = err
        data.title = 'Editar Usuario'
        return res.render('usuario/form', data)
      }

      return res.redirect(url.siteUrl('usuarios'))
    })
  }

}

exports.delete = async (req, res) => {
  let usuario_id = req.params.usuario_id

  try {
    let pedidos = await PedidoModel.count({conductor: usuario_id}).exec()
    if (pedidos > 0) {
      await UsuarioModel.findByIdAndUpdate({_id: usuario_id}, {status: 0}).exec()
    }
    else {
      await UsuarioModel.findOneAndRemove({_id: usuario_id}).exec()
    }
    return res.redirect(url.siteUrl('usuarios'))
  }
  catch (err) {
    return res.render('404', {error: err})
  }
}


