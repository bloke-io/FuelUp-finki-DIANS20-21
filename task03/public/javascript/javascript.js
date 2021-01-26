let latitude = 0, longitude = 0, marker = [];
var theMarker = {};
//JQuery


$(document).ready(function () {
    $('.stars a').on('click', function () {
        $('.stars span, .stars a').removeClass('active');
        $(this).addClass('active');
        $('.stars span').addClass('active');
    });
    //=================== ALL FUEL STATIONS IN MACEDONIA ================================================
    $("#btn1").click(function () {
        deleteLayers();
        $.getJSON('benzinski.txt', function (data) {
            $.each(data.benzinski, function (i, ben) {
                if (ben.name === "" || ben.name === "none") {
                } else {
                    let name = ben.name, lon = ben.lon,
                        lat = ben.lat, diesel = ben.diesel,
                        lpg = ben.lpg, open = ben.opening_hours;
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
            });
            map.setView([41.6086, 21.7453], 8);
        }).error(function () {
            console.log('Base not loaded');
        });
    }).hover(function () {
        $(this).css({
            "color": "green",
            cursor: 'pointer'
        })
    }, function () {
        $(this).css("color", "black")
    });
    //=================== NEAREST FUEL STATIONS AROUND YOU ================================================
    $("#btn2").click(function () {
        deleteLayers();
        getYourLocation();
        $.getJSON('benzinski.txt', function (data) {
            $.each(data.benzinski, function (i, ben) {
                let name = ben.name, lon = ben.lon,
                    lat = ben.lat, diesel = ben.diesel,
                    lpg = ben.lpg, open = ben.opening_hours;
                if (parseFloat(lon).toFixed(0) === parseFloat(longitude).toFixed(0)
                    && parseFloat(lat).toFixed(0) === parseFloat(latitude).toFixed(0)) {
                    if (ben.name !== "" && ben.name !== "none") {
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
                }
            });
            map.setView([latitude, longitude], 9);
        }).error(function () {
            console.log('Base not loaded');
        });
    }).hover(function () {
        $(this).css({
            "color": "green",
            cursor: 'pointer'
        })
    }, function () {
        $(this).css("color", "black")
    });
    //=================== NEAREST FUEL STATION ================================================
    $("#btn3").click(function () {
        deleteLayers();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(UserLocation);
        } else console.log("error");
    }).hover(function () {
        $(this).css({
            "color": "green",
            cursor: 'pointer'
        })
    }, function () {
        $(this).css("color", "black")
    });
    //=================== FIND THE NEAREST PETROL STATIONS BY NAME ================================================
    $(".btn-right").click(function () {
        StationsByName();
    });
    $("#enterName").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            StationsByName();
        }
    });

    //STATIONS BY NAME
    function StationsByName() {
        let input = $('#enterName').val(), flag = false;
        input = input[0].toUpperCase() + input.slice(1);
        deleteLayers();
        getYourLocation();
        $.getJSON('benzinski.txt', function (data) {
            $.each(data.benzinski, function (i, ben) {
                let name = ben.name, lon = ben.lon,
                    lat = ben.lat, diesel = ben.diesel,
                    lpg = ben.lpg, open = ben.opening_hours;
                if (parseFloat(lon).toFixed(0) === parseFloat(longitude).toFixed(0)
                    && parseFloat(lat).toFixed(0) === parseFloat(latitude).toFixed(0)) {
                    if (ben.name === input) {
                        flag = true;
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
                                '<input type="text"  placeholder="Comment for service"></div>');
                        marker.push(LamMarker);
                    }
                }
            });
            if (!flag) {
                alert("There is not fuel station with that name!")
            } else map.setView([latitude, longitude], 9);
        }).error(function () {
            console.log('Base not loaded');
        });
    }

    function commentService(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            console.log('fleze')
        }
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    //=================== FIND YOUR LOCATION ================================================
    // $(".btn-location").click(function () {
    //     // if (navigator.geolocation) {
    //     //     navigator.geolocation.getCurrentPosition(showPosition);
    //     // } else {
    //     //     x.innerHTML = "Geolocation is not supported by this browser.";
    //     // }
    // });

    function showPosition(position) {
        if (theMarker != undefined) {
            map.removeLayer(theMarker);
        }
        let name = "Your Location";
        let myIcon = L.icon({
            iconUrl: 'images/pin48.png',
            iconRetinaUrl: 'pin48.png',
            iconSize: [40, 40],
            iconAnchor: [9, 21],
            popupAnchor: [0, -14]
        });
        theMarker = L.marker([position.coords.latitude, position.coords.longitude], {icon: myIcon}).addTo(map)
            .bindPopup('<label><h5>' + name + '</h5></label>').openPopup();
        map.setView([position.coords.latitude, position.coords.longitude], 11);
    }
});


// JavaScript

function deleteLayers() {
    for (let i = 0; i < marker.length; i++) {
        map.removeLayer(marker[i]);
    }
    marker.length = 0;
}

function getYourLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        })
    }
}

// Callback function for asynchronous call to HTML5 geolocation
function UserLocation(position) {
    NearestFuel(position.coords.latitude, position.coords.longitude);
}

// Convert Degress to Radians
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

function NearestFuel(latitude, longitude) {
    let minDif = 99999, closestLat, closestLon, closestName, closestDisel, closestLPG, closestOpen;
    $.getJSON('benzinski.txt', function (data) {
        $.each(data.benzinski, function (i, ben) {
            let name = ben.name, lon = ben.lon, lat = ben.lat, diesel = ben.diesel,
                lpg = ben.lpg, open = ben.opening_hours;
            if (ben.name === "" || ben.name === "none") {
            } else {
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
            }
        });
        let LamMarker = L.marker([closestLat, closestLon]).addTo(map)
            .bindPopup('<div  id="popUpMarker"><h5>' + closestName + '</h5><br>'
                + '<ul><li>Disel: ' + closestDisel.toUpperCase() + '</li><li>LPG: ' + closestLPG.toUpperCase() + '<li>'
                + 'Open: ' + closestOpen + '<t></ul>' + 'Evaluate the service:' + '<br>' +
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
        map.setView([latitude, longitude], 11);
    }).error(function () {
        console.log('Base not loaded');
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert( "Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    alert( "Latitude: " + position.coords.latitude +"<br>Longitude: " + position.coords.longitude);
}
