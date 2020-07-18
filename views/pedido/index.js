$(function () {

  $('#show_pedido').on('click', function (e) {
    e.preventDefault()
    $('#imagen_titulo').html('Nota de Pedido')
    $('#imagen_contenido').html($(this).html())
    $('#imagen_contenido img').css('width', '100%')
    $('#imagen_modal').modal('show')
  })

  $('#show_odometro').on('click', function (e) {
    e.preventDefault()
    $('#imagen_titulo').html('Od&oacute;metro')
    $('#imagen_contenido').html($(this).html())
    $('#imagen_contenido img').css('width', '100%')
    $('#imagen_modal').modal('show')
  })

  $('#delete_pedido').on('click', function (e) {
    e.preventDefault()
    if (window.confirm('ESTE PEDIDO SERA ELIMINADO PERMANENTE. ¿ESTAS SEGURO?')) {
      $.ajax({
        url: $('#site_url').val() + 'pedidos/eliminar/' + $(this).attr('data-id'),
        method: 'POST',
        dataType: 'json',
        success: function (data) {
          if (data.success) {
            // window.location.reload(history.back(-1))
            window.location = document.referrer
          }
          else {
            alert('No se pudo eliminar el pedido')
          }
        },
        error: function () {
          alert('Error inesperado')
        }
      })
    }
  })

  $('.chosen-select').chosen()
  var options = daterangepicker_options
  options.startDate = $('#fecha').attr('data-start_date')
  options.endDate = $('#fecha').attr('data-end_date')
  $('#fecha').daterangepicker(options)

  $('table').DataTable({
    'paging': true,
    'lengthMenu': [[10, 25, 50, -1], [10, 25, 50, 'Todos']],
    'info': true,
    'language': {
      'url': $('#site_url').val() + 'datatable_esp.json'
    }
  })

  $('[data-toggle="tooltip"]').tooltip()

})