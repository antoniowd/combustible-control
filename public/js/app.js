
$(function(){


    $('.confirm-action').on('click', function(e){
        if(!window.confirm("Estas seguro de realizar esta accion"))
            e.preventDefault();
    });


});