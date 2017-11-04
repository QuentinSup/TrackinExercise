
interface Window {
    directionsService,
    map,
    infoWindow  
}

var directionsService;
var map;
var roads = [];

function initMap() {

    let sf = { lat: 37.774929, lng: -122.419416 };

    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: sf
    });

    let marker = new google.maps.Marker({
        position: sf,
        map: map
    });

    return map;
}

function createRoadObject(directions) {
    for (let i = 0; i < directions.routes.length; i++) {

        // Define a symbol using SVG path notation, with an opacity of 1.
        var lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: .5,
            scale: 4
        };

        let polylineOptions = i == 1 ? null : new google.maps.Polyline({
            strokeColor: '#101010',
            strokeOpacity: 0.2,
            strokeWeight: 5,
            icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '20px'
            }],
        });

        let road = new google.maps.DirectionsRenderer({
            preserveViewport: true,
            routeIndex: i,
            directions: directions,
            draggable: false,
            map: map,
            polylineOptions: polylineOptions,
            suppressMarkers: true
        });

        roads.push(road);
    }

}

function cleanRoads() {
    for (var i = 0; i < roads.length; i++) {
        let road = roads[i];
        road.setMap(null);
    }
    roads = [];
}

function addWayPointMarker(waypoint) {

    if (waypoint.marker) {
        return waypoint.marker;
    }

    var marker = new google.maps.Marker({
        position: { lat: parseFloat(waypoint.latitude), lng: parseFloat(waypoint.longitude) },
        map: map,
        icon: {
            url: waypoint.type() == 1 ? 'resources/assets/images/dropoff-icon.png' : 'resources/assets/images/pickup-icon.png',
            scaledSize: new google.maps.Size(35, 35)
        },
        title: waypoint.label,
        customData: {
            waypoint: waypoint
        }
    });

    waypoint.marker = marker;

    var infoWindow = new google.maps.InfoWindow({
        content: '<strong>' + waypoint.label + '</strong> '
    });

    waypoint.infoWindow = infoWindow;

    marker.addListener('click', function() {

        if (window.infoWindow) {
            window.infoWindow.close();
        }

        infoWindow.open(map, this);

        window.infoWindow = infoWindow;

    });

    return marker;
}


function drawRoute(from, to) {

    if (!from || !to) {
        return;
    }

    var request = {
        origin: from,
        destination: to,
        optimizeWaypoints: true,
        provideRouteAlternatives: true,
        travelMode: google.maps.TravelMode.DRIVING
    };

    // populate yor box/field with lat, lng
    window.directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            createRoadObject(response);
        }
    });
}

function initGMap() {

    window.directionsService = new google.maps.DirectionsService();

    var map = window.map = initMap();

    // Create the search box and link it to the UI element.
    var input = document.getElementById('search-input');
    var searchBox = new google.maps.places.SearchBox(input);

    var markers = [];



    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });


    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });

        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            var waypoint = new models.WayPoint(place.name);
            waypoint.setCoordinates(place.geometry.location.lat(), place.geometry.location.lng());
            createWayPoint(waypoint);

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}