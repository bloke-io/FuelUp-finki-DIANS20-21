//JQuery
$(document).ready(function () {
    $("#btn1").click(function () { //ALL FUEL STATIONS IN MACEDONIA
        deleteLayers();
        $.getJSON('benzinski.txt', function (data) {
            $.each(data.benzinski, function (i, ben) {
                if (ben.name === "" || ben.name === "none") {

                } else {
                    var ime = ben.name;
                    var lon = ben.lon;
                    var lat = ben.lat;
                    var diesel = ben.diesel;
                    var lpg = ben.lpg;
                    var open = ben.opening_hours;
                    if (diesel == "" )
                        diesel = "yes";
                    if(lpg == "")
                        lpg = "yes";
                    if(open=="")
                        open = "08h-20h";
                    var LamMarker = L.marker([lat, lon])
                        .bindPopup('<label>' + ime + '<br>'+'Disel: '+ diesel +'<br>'+'LPG:'+lpg+'<br>'+'Open:'+open+'</label>')
                        .addTo(map);
                    marker.push(LamMarker);
                }
            });
        }).error(function () {
            console.log('error');
        });
    });
    $("#btn2").click(function () { //NEAREST FUEL STATIONS AROUND YOU
        deleteLayers();
        getYourLocation();
        $.getJSON('benzinski.txt', function (data) {
            $.each(data.benzinski, function (i, ben) {
                var ime = ben.name;
                var lon = ben.lon;
                var lat = ben.lat;
                var diesel = ben.diesel;
                var lpg = ben.lpg;
                var open = ben.opening_hours;
                if (parseFloat(lon).toFixed(0) === parseFloat(longitude).toFixed(0)
                    && parseFloat(lat).toFixed(0) === parseFloat(latitude).toFixed(0)) {
                    if (ben.name === "" || ben.name === "none") {

                    } else {
                        if (diesel === "" )
                            diesel = "yes";
                        if(lpg === "")
                            lpg = "yes";
                        if(open==="")
                            open = "08h-20h";
                        var LamMarker = L.marker([lat, lon])
                            .bindPopup('<label>' + ime + '<br>'+'Disel: '+ diesel +'<br>'+'LPG:'+lpg+'<br>'+'Open:'+open+'</label>')
                            .addTo(map);
                        marker.push(LamMarker);
                    }
                }
            });
        }).error(function () {
            console.log('error');
        });
    });
    $(".btn-right").click(function () {
        var input = $('#enterName').val();
        deleteLayers();
        marker = new Array();
        getYourLocation();
        $.getJSON('benzinski.txt', function (data) {
            $.each(data.benzinski, function (i, ben) {
                var ime = ben.name;
                var lon = ben.lon;
                var lat = ben.lat;
                var diesel = ben.diesel;
                var lpg = ben.lpg;
                var open = ben.opening_hours;
                if (parseFloat(lon).toFixed(0) === parseFloat(longitude).toFixed(0)
                    && parseFloat(lat).toFixed(0) === parseFloat(latitude).toFixed(0)) {
                    if (ben.name === "" || ben.name === "none") {

                    } else if (ben.name === input) {
                        if (diesel === "" )
                            diesel = "yes";
                        if(lpg === "")
                            lpg = "yes";
                        if(open=== "")
                            open = "08h-20h";
                        var LamMarker = L.marker([lat, lon])
                            .bindPopup('<label>' + ime + '<br>'+'Disel: '+ diesel +'<br>'+'LPG:'+lpg+'<br>'+'Open:'+open+'</label>')
                            .addTo(map);
                        marker.push(LamMarker);
                    }
                }
            });
        }).error(function () {
            console.log('error');
        });
    })
    $(".btn-location").click(function () {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                markers = [
                    {
                        "name": "Your Location",
                        "lat": latitude,
                        "lng": longitude
                    }];
                var myIcon = L.icon({
                    iconUrl: 'images/pin48.png',
                    iconRetinaUrl: 'pin48.png',
                    iconSize: [40, 40],
                    iconAnchor: [9, 21],
                    popupAnchor: [0, -14]
                });
                for (var i = 0; i < markers.length; ++i) {
                    L.marker([markers[i].lat, markers[i].lng],{icon: myIcon})
                        .bindPopup('<label>' + markers[i].name + '</label>')
                        .addTo(map);
                }
            });
        } else {
            console.log("Browser doesn't support geolocation!");
        }
    });
    $("#btn3").hover(function (){
        $(this).css({
            "color":"green",
            cursor: 'pointer'
        })
    }, function (){
        $(this).css("color","black")
    })
    $("#btn3").click(function (){
        deleteLayers();
        OneNearst();
    })
});
// global
var latitude;
var longitude;
var marker = new Array();

//functions
function deleteLayers() {
    for (i = 0; i < marker.length; i++) {
        map.removeLayer(marker[i]);
    }
    marker = new Array();
}

function getYourLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        })
    }
}

///////////////////////////////////////////////////////////////////////////////////////

// Get User's Coordinate from their Browser
function OneNearst() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(UserLocation);
    }
    else
        console.log("error");
    //NearestCity(38.8951, -77.0367);
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
    var R = 6371; // km
    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = (lat2 - lat1);
    var d = Math.sqrt(x * x + y * y) * R;
    return d;
}

function NearestCity(latitude, longitude) {
    var minDif = 99999;
    var closestLat;
    var closestLon;
    var closestIme;
    var closestDisel;
    var closestLPG;
    var closestOpen;
    $.getJSON('benzinski.txt', function (data) {
        $.each(data.benzinski, function (i, ben) {
            var ime = ben.name;
            var lon = ben.lon;
            var lat = ben.lat;
            var diesel = ben.diesel;
            var lpg = ben.lpg;
            var open = ben.opening_hours;
            if (ben.name === "" || ben.name === "none") {

            } else {
                var dif = PythagorasEquirectangular(latitude, longitude, lat, lon);
                if (dif < minDif) {
                    closestLat = lat;
                    closestLon = lon;
                    closestIme = ime;
                    closestDisel = diesel;
                    closestLPG = lpg;
                    closestOpen = open;
                    minDif = dif;
                }
            }
        });
        if (closestDisel === "" )
            closestDisel = "yes";
        if(closestLPG === "")
            closestLPG = "yes";
        if(closestOpen=== "")
            closestOpen = "08h-20h";
        var LamMarker = L.marker([closestLat, closestLon])
            .bindPopup('<label>' + closestIme + '<br>'+'Disel: '+ closestDisel +'<br>'+'LPG:'+closestLPG+'<br>'+'Open:'+closestOpen+'</label>')
            .addTo(map);
        marker.push(LamMarker);
    }).error(function () {
        console.log('error');
    });
}