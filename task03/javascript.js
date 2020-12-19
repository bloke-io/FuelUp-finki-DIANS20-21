let latitude, longitude, marker =[];

//JQuery

$(document).ready(function () {
    //=================== ALL FUEL STATIONS IN MACEDONIA ================================================
    $("#btn1").click(function () {
        deleteLayers();
        $.getJSON('benzinski.txt', function (data) {
            $.each(data.benzinski, function (i, ben) {
                if (ben.name === "" || ben.name === "none") {}
                else{
                    let name = ben.name, lon = ben.lon,
                    lat = ben.lat, diesel = ben.diesel,
                    lpg = ben.lpg, open = ben.opening_hours;
                    let LamMarker = L.marker([lat, lon]).addTo(map)
                        .bindPopup('<label>'+'<h5>'+name+'</h5>' + 'Disel: ' + diesel + '<br>' + 'LPG: ' + lpg + '<br>' + 'Open: ' + open + '</label>');
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
                    if (ben.name === "" || ben.name === "none") {}
                    else {
                        let LamMarker = L.marker([lat, lon]).addTo(map)
                            .bindPopup('<label>'+'<h5>'+name+'</h5>' + 'Disel: ' + diesel + '<br>' + 'LPG: ' + lpg + '<br>' + 'Open: ' + open + '</label>');
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
        OneNearst();
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
        let input = $('#enterName').val();
        deleteLayers();
        getYourLocation();
        $.getJSON('benzinski.txt', function (data) {
            $.each(data.benzinski, function (i, ben) {
                let name = ben.name, lon = ben.lon,
                    lat = ben.lat, diesel = ben.diesel,
                    lpg = ben.lpg, open = ben.opening_hours;
                if (parseFloat(lon).toFixed(0) === parseFloat(longitude).toFixed(0)
                    && parseFloat(lat).toFixed(0) === parseFloat(latitude).toFixed(0)) {
                    if (ben.name === "" || ben.name === "none") {}
                    else if (ben.name === input) {
                        let LamMarker =  L.marker([lat, lon]).addTo(map)
                            .bindPopup('<label>'+'<h5>'+name+'</h5>' + 'Disel: ' + diesel + '<br>' + 'LPG: ' + lpg + '<br>' + 'Open: ' + open + '</label>');
                        // let LamMarker = L.marker([lat, lon])
                        //     .bindPopup('<label>'+'<h5>'+name+'</h5>' + 'Disel: ' + diesel + '<br>' + 'LPG: ' + lpg + '<br>' + 'Open: ' + open + '</label>')
                        //     .addTo(map);
                        marker.push(LamMarker);
                    }
                }
            });
            map.setView([latitude, longitude], 9);
        }).error(function () {
            console.log('Base not loaded');
        });
    });
    //=================== FIND YOUR LOCATION ================================================
    $(".btn-location").click(function () {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                let markers = [{
                    "name": "Your Location",
                    "lat": latitude,
                    "lng": longitude
                }];
                let myIcon = L.icon({
                    iconUrl: 'images/pin48.png',
                    iconRetinaUrl: 'pin48.png',
                    iconSize: [40, 40],
                    iconAnchor: [9, 21],
                    popupAnchor: [0, -14]
                });
                for (let i = 0; i < markers.length; ++i) {
                    L.marker([markers[i].lat, markers[i].lng], {icon: myIcon})
                        .bindPopup('<h3>' + markers[i].name + '</h3>').addTo(map)
                        .openPopup();
                }
                map.setView([latitude, longitude], 11);
            });
        } else {
            console.log("Browser doesn't support geolocation!");
        }
    });
});


// JavaScript

function deleteLayers() {
    for (let i = 0; i < marker.length; i++) {
        map.removeLayer(marker[i]);
    }
}

function getYourLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        })
    }
}

// Get User's Coordinate from their Browser
function OneNearst() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(UserLocation);
    } else
        console.log("error");
}

// Callback function for asynchronous call to HTML5 geolocation
function UserLocation(position) {
    NearestCity(position.coords.latitude, position.coords.longitude);
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

function NearestCity(latitude, longitude) {
    let minDif = 99999, closestLat, closestLon, closestName, closestDisel, closestLPG, closestOpen;
    $.getJSON('benzinski.txt', function (data) {
        $.each(data.benzinski, function (i, ben) {
            let name = ben.name, lon = ben.lon, lat = ben.lat, diesel = ben.diesel,
                lpg = ben.lpg, open = ben.opening_hours;
            if (ben.name === "" || ben.name === "none") {}
            else {
                let dif = PythagorasEquirectangular(latitude, longitude, lat, lon);
                if (dif < minDif) {
                    closestLat = lat; closestLon = lon;
                    closestName = name; closestDisel = diesel;
                    closestLPG = lpg; closestOpen = open; minDif = dif;
                }
            }
        });
        let LamMarker = L.marker([closestLat, closestLon]).addTo(map)
            .bindPopup('<label>'+'<h5>'+closestName+'</h5>'+'Disel: ' + closestDisel + '<br>' + 'LPG: ' + closestLPG + '<br>' + 'Open: ' + closestOpen + '</label>');
        marker.push(LamMarker);
        map.setView([latitude, longitude], 11);
    }).error(function () {
        console.log('Base not loaded');
    });
}