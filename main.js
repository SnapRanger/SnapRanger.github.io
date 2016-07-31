var API_KEY = 'AIzaSyDh4DBiOnOtGIHdwJTrVdDWupmYjtnWCcY';

var map;
var jsonData;
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -28, lng: 153.35 },
        zoom: 12
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

function closePopup() {
    document.getElementById('popup').style.zIndex = '-1';
    document.getElementById('popup').style.display = 'none';
}

function createMarkers(data) {
    markers = [];
    // for (var i = 0; i < data.length; i++) {
    for (var i = 0; i < data.length; i=i+5) {
        var marker = new google.maps.Marker({
            position: { lat: data[i].Y, lng: data[i].X },
            title: data[i].COMMONNAME,
            icon: getIconName(data[i].EPBCSTATUS)
        });
        marker.data = data[i];
        markers.push(marker);

        google.maps.event.addListener(marker, 'click', function(e) {
            createHTMLString(this.data);
        });
    }
}

function createHTMLString(data) {
    var status = data.EPBCSTATUS ? data.EPBCSTATUS : 'Common';
    var str = '<div class="container" id="content"><div id="close" onclick="closePopup()">'+
        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div>'+
        '<h1 id="firstHeading" class="firstHeading">' + data.COMMONNAME + '</h1>'+
        '<img src="images/defaultAnimalAvatar.jpg"></img>'+
        '<div id="bodyContent">'+
        '<p>GENUS: '+data.GENUS+'</p>'+
        '<p>SPECIES: '+data.SPECIES+'</p>'+
        '<p>STATUS: '+ status+'</p>'+
        '</div>'+
        '</div>';
    var popup = document.getElementById('popup');
    var popupData = document.getElementById('popupData');
    popupData.innerHTML = str;
    popup.style.zIndex = '10';
    popup.style.display = 'block';

    return str;
}

function showMarkers() {
    // var items = 10;
    // for (var j = 0; j < items; j++) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
        // TODO: to do better processing of data
    // }
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
    query(queryString);
});

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var queryString = document.getElementById('search').value;
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
