$(function () {

    $('table').DataTable({
        "paging": true,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
        "info": true,
        "language": {
            "url": $('#site_url').val() + "datatable_esp.json"
        }
    });

    $('[data-toggle="tooltip"]').tooltip();

});