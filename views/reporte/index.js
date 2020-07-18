$(function () {

  $('.chosen-select').chosen()
  var options = daterangepicker_options
  options.startDate = $('#fecha').attr('data-start_date')
  options.endDate = $('#fecha').attr('data-end_date')
  $('#fecha').daterangepicker(options)

  $('[data-toggle="tooltip"]').tooltip()

  $('#download_excel').on('click', function (e) {
    e.preventDefault()

    var uri = 'data:application/vnd.ms-excel;base64,'
      ,
      template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
      , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p] }) }
    if (!table.nodeType) table = document.getElementById('table')
    var ctx = {worksheet: $('#download_excel').attr('data-filename') || 'Hoja1', table: table.innerHTML}
    // window.location.href = uri + base64(format(template, ctx))

    var a = $('<a>')
      .attr('href', uri + base64(format(template, ctx)))
      .attr('download', $('#download_excel').attr('data-filename') + ' (' + date.format(new Date(), 'DD-MM-YYYY hh:mm A') + ').xls')
      .appendTo('body')
    a[0].click()
    a.remove()

  })

  $('#download_pdf').on('click', function (e) {
    e.preventDefault()

    var elem = document.getElementById('table')
    html2pdf(elem, {
      margin: 0.1,
      filename: $('#download_excel').attr('data-filename') + ' (' + date.format(new Date(), 'DD-MM-YYYY hh:mm A') + ').pdf',
      image: {type: 'jpeg', quality: 0.98},
      html2canvas: {dpi: 192, letterRendering: true},
      jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
    })
  })

})