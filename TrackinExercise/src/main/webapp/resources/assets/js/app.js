var models;
(function (models) {
    var WayPoint = /** @class */ (function () {
        function WayPoint(json) {
            var _this = this;
            this.type = ko.observable(0);
            this.distance = ko.observable(0);
            this.duration = ko.observable(0);
            if (typeof (json) == 'object') {
                this.fromJson(json);
            }
            if (typeof (json) == 'string') {
                this.label = json;
            }
            this.distanceInMiles = ko.computed(function () {
                var distance = _this.distance();
                return Math.round(distance / WayPoint.MILE * 100) / 100;
            }).extend({ throttle: 100 });
            this.durationInMinutes = ko.computed(function () {
                var duration = _this.duration();
                return Math.round(duration / 60);
            }).extend({ throttle: 100 });
        }
        WayPoint.prototype.data = function () {
            return {
                id: this.id,
                label: this.label,
                latitude: this.latitude,
                longitude: this.longitude,
                position: this.position,
                type: this.type()
            };
        };
        WayPoint.prototype.toJson = function () {
            return JSON.stringify(this.data());
        };
        WayPoint.prototype.fromJson = function (json) {
            this.id = json.id;
            this.label = json.label;
            this.latitude = json.latitude;
            this.longitude = json.longitude;
            this.position = json.position;
            this.type(json.type);
        };
        WayPoint.prototype.getCoordinates = function () {
            return {
                lat: parseFloat(this.latitude),
                lng: parseFloat(this.longitude)
            };
        };
        WayPoint.prototype.setCoordinates = function (lat, lng) {
            this.latitude = lat;
            this.longitude = lng;
        };
        WayPoint.prototype.setType = function (n) {
            this.type(n);
        };
        WayPoint.prototype.save = function (fn) {
            if (!this.id) {
                // Create
                WayPoint.create(this, fn);
            }
            else if (this.id == -1) {
                // Delete
                WayPoint.remove(this, fn);
            }
            else {
                // Update
                WayPoint.update(this, fn);
            }
        };
        WayPoint.prototype.remove = function (fn) {
            WayPoint.remove(this, fn);
        };
        WayPoint.create = function (wayPoint, fn) {
            $.ajax({
                method: 'POST',
                url: WayPoint.API,
                data: wayPoint.toJson(),
                contentType: "application/json"
            }).done(function (wayPointData) {
                // Update id
                wayPoint.id = wayPointData.id;
                if ($.isFunction(fn)) {
                    fn.call(this);
                }
            });
        };
        WayPoint.update = function (wayPoint, fn) {
            $.ajax({
                method: 'PUT',
                url: WayPoint.API + "/" + wayPoint.id,
                data: wayPoint.toJson(),
                contentType: "application/json"
            }).done(function (wayPointData) {
                if ($.isFunction(fn)) {
                    fn.call(this);
                }
            });
        };
        WayPoint.remove = function (wayPoint, fn) {
            $.ajax({
                method: 'DELETE',
                url: WayPoint.API + "/" + wayPoint.id,
                contentType: "application/json"
            }).done(function (wayPointData) {
                wayPoint.id = null;
                if ($.isFunction(fn)) {
                    fn.call(this);
                }
            });
        };
        WayPoint.list = function (fn) {
            $.getJSON(WayPoint.API).done(function (data) {
                if ($.isFunction(fn)) {
                    fn.call(this, data);
                }
            });
        };
        WayPoint.API = "api/waypoints";
        WayPoint.MILE = 1609.344;
        return WayPoint;
    }());
    models.WayPoint = WayPoint;
})(models || (models = {}));
var directionsService;
var map;
var roads = [];
function initMap() {
    var sf = { lat: 37.774929, lng: -122.419416 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: sf
    });
    var marker = new google.maps.Marker({
        position: sf,
        map: map
    });
    return map;
}
function createRoadObject(directions) {
    for (var i = 0; i < directions.routes.length; i++) {
        // Define a symbol using SVG path notation, with an opacity.
        var lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: .5,
            scale: 4
        };
        var polylineOptions = i == 0 ? null : new google.maps.Polyline({
            strokeColor: '#101010',
            strokeOpacity: 0.2,
            strokeWeight: 5,
            icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '20px'
                }]
        });
        var road = new google.maps.DirectionsRenderer({
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
        var road = roads[i];
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
    marker.addListener('click', function () {
        if (window.infoWindow) {
            window.infoWindow.close();
        }
        infoWindow.open(map, this);
        window.infoWindow = infoWindow;
    });
    return marker;
}
function centerizeWayPoint(wayPoint) {
    map.panTo(wayPoint.marker.position);
    if (map.getZoom() < 12) {
        map.setZoom(12);
    }
}
function drawRoute(from, to, fn) {
    if (!from || !to) {
        return;
    }
    var request = {
        origin: from,
        destination: to,
        optimizeWaypoints: true,
        provideRouteAlternatives: true,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        travelMode: google.maps.TravelMode.DRIVING
    };
    // populate your box/field with lat, lng
    window.directionsService.route(request, function (directions, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            createRoadObject(directions);
            if ($.isFunction(fn)) {
                fn.call(directions);
            }
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
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
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
            }
            else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}
// <reference path="./types/jquery/index.d.ts"/>
/// <reference path="./types/knockout/index.d.ts"/>
/// <reference path="./models/WayPoint.cls.ts"/>
/// <reference path="./gmap.ts"/>
var waypoints = ko.observableArray();
function createWayPoint(wayPoint) {
    wayPoint.save(function () {
        // Add wayPoint to route
        addWayPoint(this);
    });
}
function deleteWayPoint(wayPoint) {
    wayPoint.remove(function () {
        removeWayPoint(wayPoint);
    });
}
function addWayPoint(wayPoint, draw) {
    if (draw === void 0) { draw = true; }
    waypoints.push(wayPoint);
    var waypointsData = waypoints();
    wayPoint.setType(waypointsData.length == 1 ? 0 : 1);
    addWayPointMarker(wayPoint);
    if (draw) {
        // Draw roads
        drawWayPointsRoads();
    }
}
function drawWayPointsRoads() {
    cleanRoads();
    var waypointsData = waypoints();
    if (waypointsData.length == 0) {
        return;
    }
    waypointsData[0].duration(0);
    waypointsData[0].distance(0);
    var _loop_1 = function (i) {
        var wayPointFrom = waypointsData[i - 1];
        var wayPointTo = waypointsData[i];
        drawRoute(wayPointFrom.getCoordinates(), wayPointTo.getCoordinates(), function () {
            var duration = this.routes[0].legs[0].duration.value;
            var distance = this.routes[0].legs[0].distance.value;
            wayPointTo.duration(duration);
            wayPointTo.distance(distance);
        });
    };
    for (var i = 1; i < waypointsData.length; i++) {
        _loop_1(i);
    }
}
function removeWayPoint(wayPoint) {
    // Remove waypoint from list
    waypoints.remove(wayPoint);
    // Remove marker from map
    wayPoint.marker.setMap(null);
    // Redraw roads (could be optimized)
    drawWayPointsRoads();
}
function retrieveWayPointList() {
    models.WayPoint.list(function (data) {
        $.each(data, function (n, waypointJson) {
            addWayPoint(new models.WayPoint(waypointJson), false);
        });
        drawWayPointsRoads();
        $('#waypoints > ul').sortable({
            update: function (event, ui) {
                updateWayPointsPositions();
            }
        });
    });
}
function updateWayPointsPositions() {
    var wpoints = [];
    $('#waypoints > ul > li').each(function () {
        var $item = $(this);
        var wayPoint = ko.dataFor(this);
        if (wayPoint.position != $item.index()) {
            wayPoint.position = $item.index();
            wayPoint.save();
        }
        wpoints.push(wayPoint);
    });
    // Update waypoint list order
    waypoints(wpoints);
    // Redraw roads (could be optimized)
    drawWayPointsRoads();
}
// JQuery load on ready
$(function () {
    var model = {
        waypoints: waypoints,
        fn: {
            createWayPoint: createWayPoint
        }
    };
    ko.applyBindings(model);
});
function onMapLoaded() {
    initGMap();
    retrieveWayPointList();
}
