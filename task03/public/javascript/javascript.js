let latitude = 0, longitude = 0, marker = [];
var theMarker = {};

//JQuery
function deleteLayers() {
    for (let i = 0; i < marker.length; i++) {
        map.removeLayer(marker[i]);
    }
    marker.length = 0;
}

function Deg2Rad(deg) {
    return deg * Math.PI / 180;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
    lat1 = Deg2Rad(lat1);
    lat2 = Deg2Rad(lat2);
    lon1 = Deg2Rad(lon1);
    lon2 = Deg2Rad(lon2);
    let R = 6371; // km
    let x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    let y = (lat2 - lat1);
    return Math.sqrt(x * x + y * y) * R;
}

class FuelsStation {
    getFuels(button) {
        let minDif = 99999, closestLat, closestLon, closestName, closestDisel, closestLPG, closestOpen,flag, input;
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
                    if (button === 'btn1') {
                        PutMarker(lat, lon, name, diesel, lpg, open);
                        map.setView([41.6086, 21.7453], 8);
                    } else if (button === 'btn2' && parseFloat(lon).toFixed(0) === parseFloat(longitude).toFixed(0)
                        && parseFloat(lat).toFixed(0) === parseFloat(latitude).toFixed(0)) {
                        PutMarker(lat, lon, name, diesel, lpg, open);
                        map.setView([latitude, longitude], 9);
                    } else if (button === 'btn3') {
                        let dif = PythagorasEquirectangular(latitude, longitude, lat, lon);
                        if (dif < minDif) {
                            closestLat = lat;
                            closestLon = lon;
                            closestName = name;
                            closestDisel = diesel;
                            closestLPG = lpg;
                            closestOpen = open;
                            minDif = dif;
                        }
                    } else if ((button === 'btn4' || button === 'enterName') && parseFloat(lon).toFixed(0) === parseFloat(longitude).toFixed(0)
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
                } else map.setView([latitude, longitude], 9);
            }
        }).error(function () {
            console.log('Base not loaded');
        });
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
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        })
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