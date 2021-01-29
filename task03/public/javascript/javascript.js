let latitude = 0, longitude = 0, marker = [];
var theMarker = {};

//JQuery
function deleteLayers() {
    for (let i = 0; i < marker.length; i++) {
        map.removeLayer(marker[i]);
    }
    marker.length = 0;
}

function arePointsNear(melat, melon, fuellat, fuellon, km) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * melat / 180.0) * ky;
    var dx = Math.abs(melon - fuellon) * kx;
    var dy = Math.abs(melat - fuellat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}

function distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

class FuelsStation {
    getFuels(button) {
        let minDif = 99999, closestLat, closestLon, closestName, closestDisel, closestLPG, closestOpen,flag, input;
        let fuels= [], range = [];
        if (button === 'btn4' || button === 'enterName') {
            input = $('#enterName').val(); flag = false;
            input = input[0].toUpperCase() + input.slice(1);
        }
        $.getJSON('benzinski.txt', function (data) {
            $.each(data.benzinski, function (i, ben) {
                let name = ben.name, lon = ben.lon,
                    lat = ben.lat, diesel = ben.diesel,
                    lpg = ben.lpg, open = ben.opening_hours;
                if (ben.name !== "" && ben.name !== "none") {
                    if (button === 'btn1') {                                //get all fuels station in macedonia
                        PutMarker(lat, lon, name, diesel, lpg, open);
                        map.setView([41.6086, 21.7453], 8);
                    } else if (button === 'btn2') {
                        let area = arePointsNear(latitude, longitude, lat, lon, 40);
                        if (area) {
                            let station = lat + '/' + lon + '/' + name + '/' + diesel + '/' + lpg + '/' + open;
                            let rangeFuel = distance(latitude, longitude, lat, lon);
                            let fuelInfo = {rangeFuel, station}
                            fuels.push(fuelInfo);
                            range.push(distance(latitude, longitude, lat, lon));
                        }
                    } else if (button === 'btn3') {                         //get nearest fuel station
                        let dif = distance(latitude, longitude, lat, lon);
                        if (dif < minDif) {
                            closestLat = lat;
                            closestLon = lon;
                            closestName = name;
                            closestDisel = diesel;
                            closestLPG = lpg;
                            closestOpen = open;
                            minDif = dif;
                        }
                    } else if ((button === 'btn4' || button === 'enterName') &&  //find the nearest petrol stations by name
                        parseFloat(lon).toFixed(0) === parseFloat(longitude).toFixed(0)
                        && parseFloat(lat).toFixed(0) === parseFloat(latitude).toFixed(0)) {
                        if (name === input) {
                            flag = true;
                            PutMarker(lat, lon, name, diesel, lpg, open);
                        }
                    }
                }
            });
            if (button === 'btn3') {
                PutMarker(closestLat, closestLon, closestName, closestDisel, closestLPG, closestOpen);
                map.setView([latitude, longitude], 11);
            }
            else if (button === 'btn4' || button === 'enterName'){
                if (!flag) {
                    alert("There is not fuel station with that name!")
                } else map.setView([latitude, longitude], 11);
            }
            else if (button === 'btn2') {
                getFiveNearest(range,fuels)
                map.setView([latitude, longitude], 11)
            }
        }).error(function () {
            console.log('Base not loaded');
        });
    }
}

function getFiveNearest(range,fuels){
    range.sort(function(a, b){return a-b});
    for (var i=0; i<5; i++){
        for (var j=0; j<range.length; j++){
            if (range[i] === fuels[j].rangeFuel){
                var fuelsParts = fuels[j].station.split('/');
                PutMarker(fuelsParts[0], fuelsParts[1], fuelsParts[2], fuelsParts[3], fuelsParts[4], fuelsParts[5]);
            }
        }
    }
}

function PutMarker(lat, lon, name, diesel, lpg, open) {
    let LamMarker = L.marker([lat, lon]).addTo(map)
        .bindPopup('<div  id="popUpMarker"><h5>' + name + '</h5><br>'
            + '<ul><li>Disel: ' + diesel.toUpperCase() + '</li><li>LPG: ' + lpg.toUpperCase() + '<li>'
            + 'Open: ' + open + '<t></ul>' + 'Evaluate the service:' + '<br>' +
            '<div class="stars">\n' +
            '    <form action="">\n' +
            '        <input class="star star-5" id="star-5" type="radio" name="star"/>' +
            '        <label class="star star-5" for="star-5"></label>\n' +
            '        <input class="star star-4" id="star-4" type="radio" name="star"/>\n' +
            '        <label class="star star-4" for="star-4"></label>\n' +
            '        <input class="star star-3" id="star-3" type="radio" name="star"/>\n' +
            '        <label class="star star-3" for="star-3"></label>\n' +
            '        <input class="star star-2" id="star-2" type="radio" name="star"/>\n' +
            '        <label class="star star-2" for="star-2"></label>\n' +
            '        <input class="star star-1" id="star-1" type="radio" name="star"/>\n' +
            '        <label class="star star-1" for="star-1"></label>\n' +
            '</form></div>' +
            '<input type="text" id="comment" placeholder="Comment for service"></div>');
    marker.push(LamMarker);
}

function getYourLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        })
    }
    else {
       alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    if (theMarker !== undefined) {
        map.removeLayer(theMarker);
    }
    let name = "Your Location";
    let myIcon = L.icon({
        iconUrl: 'images/pin48.png',
        iconRetinaUrl: 'images/pin48.png',
        iconSize: [40, 40],
        iconAnchor: [9, 21],
        popupAnchor: [0, -14]
    });
    theMarker = L.marker([latitude, longitude], {icon: myIcon}).addTo(map)
        .bindPopup('<label><h5>' + name + '</h5></label>').openPopup();
    map.setView([latitude, longitude], 11);
}

function ButtonClick(button) {
    deleteLayers();
    getYourLocation();
    var object = new FuelsStation();
    object.getFuels(button.id);
}

$(document).ready(function () {
    //=================== ALL FUEL STATIONS IN MACEDONIA ================================================
    $("#btn1").click(function () {
        ButtonClick(this);
    });
    //=================== NEAREST FUEL STATIONS AROUND YOU ================================================
    $("#btn2").click(function () {
        ButtonClick(this);
    });
    //=================== NEAREST FUEL STATION ================================================
    $("#btn3").click(function () {
        ButtonClick(this);
    });
    //=================== FIND THE NEAREST PETROL STATIONS BY NAME ================================================
    $("#btn4").click(function () {
        ButtonClick(this);
    });
    $("#enterName").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            ButtonClick(this);
        }
    });
    //=================== FIND YOUR LOCATION ================================================
    $(".btn-location").click(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    });
    //=================== STARS CLICK ================================================
    $('.stars a').on('click', function () {
        $('.stars span, .stars a').removeClass('active');
        $(this).addClass('active');
        $('.stars span').addClass('active');
    });
});



