$(function () {

    $('#matricula').focus();

    $('#fecha_soat').datepicker({
        format: 'dd/mm/yyyy',
        language: 'es'
    });

    setTimeout(function () {
        $('#tipo_vehiculo').trigger('change');
    }, 200);

    $('#tipo_vehiculo').on('change', function () {
        var elem = $('#tipo_vehiculo option:selected');
        if (elem.attr('data-tipo_consumo') == 'KM') {
            $('.tipo_consumo_addon').html('KM/GL');
            $('#consumo_ciudad_block').find('label').first().html('Consumo Ciudad');
            $('#consumo_carretera_block').show();
            $('#consumo_ciudad_block').show();
            $('#consumo_carretera').addClass('field-required');
            $('#consumo_carretera').addClass('field-numeric');

        }
        else if (elem.attr('data-tipo_consumo') == 'HORA') {
            $('.tipo_consumo_addon').html('GL/HR');
            $('#consumo_ciudad_block').find('label').first().html('Consumo por Hora');
            $('#consumo_carretera_block').hide();
            $('#consumo_ciudad_block').show();
            $('#consumo_carretera').removeClass('field-required');
            $('#consumo_carretera').removeClass('field-numeric');
        }
        else {
            $('.tipo_consumo_addon').html('');
            $('#consumo_carretera_block').hide();
            $('#consumo_ciudad_block').hide();
        }
    });

    $('form').on('submit', function () {
        var flag = true;
        $('.field-required').each(function () {
            var input = $(this);
            if (input.val() == "") {
                show_error(input.attr('id'), 'Campo obligatorio');
                flag = false;
            }
            else hide_error(input.attr('id'));
        });
        if (!flag) return false;

        flag = true;
        $('.field-numeric').each(function () {
            var input = $(this);
            if (isNaN(input.val())) {
                show_error(input.attr('id'), 'Campo num&eacute;rico');
                flag = false;
            }
            else hide_error(input.attr('id'));
        });

        if (!flag) return false;

    });

    $('.field-numeric').on('keyup', function () {
        if (isNaN($(this).val())) {
            show_error($(this).attr('id'), 'Campo num&eacute;rico');
        }
        else hide_error($(this).attr('id'));
    });


});


function show_error(elem, error) {
    $('#' + elem + '_block').addClass('has-error');
    $('#' + elem + '_error').html(error);
}

function hide_error(elem) {
    $('#' + elem + '_block').removeClass('has-error');
    $('#' + elem + '_error').html('');
}

