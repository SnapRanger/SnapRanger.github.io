var API_KEY = 'AIzaSyDh4DBiOnOtGIHdwJTrVdDWupmYjtnWCcY';
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.


// function getCsv(filepath, callback) {
//     $.ajax({
//         type: "GET",
//         url: filepath,
//         dataType: "json",
//         success: function(data) {
//             callback(data);
//         },
//         error: function(xhr, ajaxOptions, thrownError) {
//             alert("Status: " + xhr.status + "     Error: " + thrownError);
//         }
//     });
// };

// function (str) {

// }

var map;
var jsonData;
var markers = [];
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -28, lng: 153.5 },
        zoom: 10
    });

    $.ajax({
        type: "GET",
        url: 'data.json',
        dataType: "json",
        success: function(data) {
            jsonData = data;
            createMarkers(jsonData);
            showMarkers();
        },
        error: function(xhr, ajaxOptions, thrownError) {
            alert("Status: " + xhr.status + "     Error: " + thrownError);
        }
    });
}

function createMarkers(data) {
    markers = [];
    // for (var i = 100; i < 200; i++) {
        console.log(data[189]);
        console.log(getIconName(data[189].EPBCSTATUS));
    // }

    for (var i = 0; i < data.length; i++) {
        var marker = new google.maps.Marker({
            position: { lat: data[i].Y, lng: data[i].X },
            title: data[i].COMMONNAME,
            icon: getIconName(data[i].EPBCSTATUS)
        });
        markers.push(marker);
    }
}

function showMarkers() {
    var items = 10;
    for (var j = 0; j < items; j++) {
        for (var i = 0; i < markers.length/items; i++) {
            markers[i].setMap(map);
        }
        // TODO: to do better processing of data
    }
}

function removeMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function getIconName(string) {
    var icon;
    switch(string) {
        case 'Marine':
            icon = 'images/mapPinMarine.png'
            break;
        case 'Vulnerable':
            icon = 'images/mapPinVulnerable.png'
            break;
        case 'Endangered':
            icon = 'images/mapPinEndangered.png'
            break;
        case 'Critically Endangered':
            icon = 'images/mapPinCriticallyEndangered.png'
            break;
        default:
            icon = 'images/mapPinNormal.png'
        }
    return icon;
}

function query(string) {
    var string = string.toLowerCase();
    removeMarkers();
    var queryMarkers = [];
    for (var i = 0; i < jsonData.length; i++) {
        if (jsonData[i].COMMONNAME.toLowerCase().indexOf(string) !== -1) {
            queryMarkers.push(jsonData[i]);
        } else if (jsonData[i].GENUS.toLowerCase().indexOf(string) !== -1) {
            queryMarkers.push(jsonData[i]);
        } else if (jsonData[i].SPECIES.toLowerCase().indexOf(string) !== -1) {
            queryMarkers.push(jsonData[i]);
        }
    }
    createMarkers(queryMarkers);
    showMarkers();
}

document.getElementById('searchBtn').addEventListener('click', function() {
    var queryString = document.getElementById('search').value;
    console.log(queryString);
    query(queryString);
});


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var accuracy = position.coords.accuracy;
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };

        map.setCenter(pos);

        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: 'Your Location',
           // icon: //the dot icon
        });
        var circle = new google.maps.Circle({
            center: pos,
            radius: accuracy,
            map: map,
            fillColor: '#0000ff',
            fillOpacity: 0.3,
            strokeColor: '#0000ff',
            strokeOpacity: 0.9,
        });

        //set the zoom level to the circle's size
        map.fitBounds(circle.getBounds());
    });

} else {
    // Browser doesn't support Geolocation
    console.error('Error: The Geolocation service failed.');
}
