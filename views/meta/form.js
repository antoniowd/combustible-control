$(function () {

    $('#codigo').focus();

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

        if($('#password').val() != $('#repeat_password').val()){
            show_error('password', 'El campo debe coincidir con repetir contrase&ntilde;a');
            flag = false;
        }

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

