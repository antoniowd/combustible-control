require.config({
    paths: {
        jquery: $('#site_url').val() + "bower_components/jquery/dist/jquery",
        autocomplete: $('#site_url').val() + "bower_components/Autocomplete/dist/autocomplete"
    }
});

var map = null;
require(["jquery", "autocomplete"], function ($, Autocomplete) {
    "use strict";
    $(function () {
        var lat = $('#lat').val() != '' ? parseFloat($('#lat').val()) : -12.043333;
        var lng = $('#lng').val() != '' ? parseFloat($('#lng').val()) : -77.028333;


        map = new GMaps({
            el: '#gmaps',
            lat: lat,
            lng: lng,
            click: function (e) {

                var latlng = e.latLng;
                map.removeMarkers();
                map.addMarker({
                    lat: latlng.lat(),
                    lng: latlng.lng()
                });

                $('#lat').val(latlng.lat());
                $('#lng').val(latlng.lng());
            }
        });

        if($('#lat').val() != '' && $('lng').val() != ''){
            map.removeMarkers();
            map.addMarker({
                lat: lat,
                lng: lng
            });
        }

        new Autocomplete({
            el: "#find_location",
            threshold: 2,
            limit: 10,
            //triggerChar: "@",
            forceSelection: true,
            debounceTime: 200,
            templates: {
                item: "{{text}}",
                value: "{{obj}}",
            },
            fetch: findResult,
            onItem: myOnItem,

        });
    });
});


var findResult = function (searchTerm, callback) {
    GMaps.geocode({
        address: $('#find_location').val(),
        callback: function (data, status) {
            if (status == 'OK') {
                var results = [];

                for (var i = 0; i < data.length; i++) {
                    var geo = data[i].geometry.location;

                    results.push({
                        text: data[i].formatted_address,
                        obj: ("<div data-lat='" + geo.lat() + "' data-lng='" + geo.lng() + "'>" + data[i].formatted_address + "</div>")
                    });
                }

                callback(results);
            }
        }
    });
};

var myOnItem = function (el) {
    var result = $($(el).data("value"));
    $("#find_location").val(result.html());

    map.setCenter(result.attr('data-lat'), result.attr('data-lng'));
    map.removeMarkers();
    map.addMarker({
        lat: result.attr('data-lat'),
        lng: result.attr('data-lng')
    });

    $('#lat').val(result.attr('data-lat'));
    $('#lng').val(result.attr('data-lng'));
};


