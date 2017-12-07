var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var trackinexercise;
(function (trackinexercise) {
    var commons;
    (function (commons) {
        var API = /** @class */ (function () {
            function API(uri) {
                this.uri = uri;
            }
            API.prototype.getUri = function () {
                return this.uri;
            };
            API.prototype.create = function (fn) {
                var _this = this;
                $.ajax({
                    method: 'POST',
                    url: this.uri,
                    data: this.toJson(),
                    contentType: "application/json"
                }).done(function (resourceData) {
                    // Update id
                    _this.id = resourceData.id;
                    if ($.isFunction(fn)) {
                        fn.call(_this, _this);
                    }
                });
            };
            API.prototype.update = function (fn) {
                var _this = this;
                $.ajax({
                    method: 'PUT',
                    url: this.uri + "/" + this.id,
                    data: this.toJson(),
                    contentType: "application/json"
                }).done(function (resourceData) {
                    if ($.isFunction(fn)) {
                        fn.call(_this, _this);
                    }
                });
            };
            API.prototype.remove = function (fn) {
                var _this = this;
                $.ajax({
                    method: 'DELETE',
                    url: this.uri + "/" + this.id,
                    contentType: "application/json"
                }).done(function () {
                    _this.id = null;
                    if ($.isFunction(fn)) {
                        fn.call(_this, _this);
                    }
                });
            };
            API.prototype.list = function (fn) {
                var _this = this;
                $.getJSON(this.uri).done(function (data) {
                    if ($.isFunction(fn)) {
                        fn.call(_this, data);
                    }
                });
            };
            API.prototype.save = function (fn) {
                if (!this.id) {
                    // Create
                    this.create(fn);
                }
                else if (this.id == -1) {
                    // Delete
                    this.remove(fn);
                }
                else {
                    // Update
                    this.update(fn);
                }
            };
            // Return waypoint data as Json
            API.prototype.toJson = function () {
                return JSON.stringify(this.data());
            };
            return API;
        }());
        commons.API = API;
    })(commons = trackinexercise.commons || (trackinexercise.commons = {}));
})(trackinexercise || (trackinexercise = {}));
var trackinexercise;
(function (trackinexercise) {
    var models;
    (function (models) {
        /**
         * Class WayPoint
         */
        var WayPoint = /** @class */ (function (_super) {
            __extends(WayPoint, _super);
            function WayPoint(json) {
                var _this = _super.call(this, WayPoint.API) || this;
                _this.type = ko.observable();
                // Data calculation
                _this.distance = ko.observable(0);
                _this.duration = ko.observable(0);
                if (typeof (json) == 'object') {
                    _this.fromJson(json);
                }
                if (typeof (json) == 'string') {
                    _this.label = json;
                }
                // Auto convert distance into miles
                _this.distanceInMiles = ko.computed(function () {
                    var distance = _this.distance();
                    return Math.round(distance / trackinexercise.MILE * 100) / 100;
                }).extend({ throttle: 100 });
                // Auto convert duration into seconds
                _this.durationInMinutes = ko.computed(function () {
                    var duration = _this.duration();
                    return Math.round(duration / 60);
                }).extend({ throttle: 100 });
                return _this;
            }
            // Return waypoint data
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
            // Set waypoint data from json
            WayPoint.prototype.fromJson = function (json) {
                this.id = json.id;
                this.label = json.label;
                this.latitude = json.latitude;
                this.longitude = json.longitude;
                this.position = json.position;
                this.type(json.type);
            };
            /**
             * Return geoposition
             */
            WayPoint.prototype.getCoordinates = function () {
                return {
                    lat: parseFloat(this.latitude),
                    lng: parseFloat(this.longitude)
                };
            };
            /**
             * Update geopos
             */
            WayPoint.prototype.setCoordinates = function (lat, lng) {
                this.latitude = lat;
                this.longitude = lng;
            };
            /**
             * Change type
             */
            WayPoint.prototype.setType = function (n) {
                this.type(n);
                // Autosave
                this.save();
            };
            WayPoint.API = "api/waypoints";
            return WayPoint;
        }(trackinexercise.commons.API));
        models.WayPoint = WayPoint;
    })(models = trackinexercise.models || (trackinexercise.models = {}));
})(trackinexercise || (trackinexercise = {}));
var trackinexercise;
(function (trackinexercise) {
    var models;
    (function (models) {
        /**
         * Class Driver
         */
        var Driver = /** @class */ (function (_super) {
            __extends(Driver, _super);
            function Driver(json) {
                var _this = _super.call(this, Driver.API) || this;
                if (typeof (json) == 'object') {
                    _this.fromJson(json);
                }
                return _this;
            }
            // Return driver data
            Driver.prototype.data = function () {
                return {
                    id: this.id,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    gender: this.gender
                };
            };
            // Set driver data from json
            Driver.prototype.fromJson = function (json) {
                this.id = json.id;
                this.firstName = json.firstName;
                this.lastName = json.lastName;
                this.gender = json.gender;
            };
            Driver.API = "api/drivers";
            return Driver;
        }(trackinexercise.commons.API));
        models.Driver = Driver;
    })(models = trackinexercise.models || (trackinexercise.models = {}));
})(trackinexercise || (trackinexercise = {}));
var trackinexercise;
(function (trackinexercise) {
    trackinexercise.MILE = 1609.344;
    /**
     * Class used to manage waypoints list
     */
    var WayPointsManager = /** @class */ (function () {
        /**
         * Constructor
         */
        function WayPointsManager() {
            var _this = this;
            this.wayPointsList = ko.observableArray();
            this.globalDuration = ko.observable();
            this.globalDistance = ko.observable();
            this._computed = ko.computed(function () {
                var wPoints = _this.wayPointsList();
                var duration = 0;
                var distance = 0;
                for (var i = 0; i < wPoints.length; i++) {
                    var wPoint = wPoints[i];
                    duration += wPoint.duration();
                    distance += wPoint.distance();
                }
                _this.globalDistance(distance);
                _this.globalDuration(duration);
            }).extend({ throttle: 100 });
            this.distanceInMiles = ko.computed(function () {
                var distance = _this.globalDistance();
                return Math.round(distance / trackinexercise.MILE * 100) / 100;
            }).extend({ throttle: 100 });
            this.durationInMinutes = ko.computed(function () {
                var duration = _this.globalDuration();
                return Math.round(duration / 60);
            }).extend({ throttle: 100 });
        }
        WayPointsManager.prototype.create = function (wayPoint, fn) {
            var _this = this;
            var wayPoints = this.all();
            // Autoset position
            wayPoint.position = wayPoints.length;
            // Autoset type (first must be pickup)
            wayPoint.type(wayPoints.length == 0 ? 0 : 1);
            // Save to database
            wayPoint.save(function (wPoint) {
                _this.wayPointsList.push(wPoint);
                if ($.isFunction(fn)) {
                    fn.call(_this, wPoint);
                }
            });
        };
        /**
         * Return all the waypoints
         */
        WayPointsManager.prototype.all = function () {
            return this.wayPointsList();
        };
        /**
         * Search a WayPoint by location (lat, lng) and return object found
         */
        WayPointsManager.prototype.getByLocation = function (location) {
            var wayPoints = this.all();
            for (var i = 0; i < wayPoints.length; i++) {
                var wayPoint = wayPoints[i];
                if (wayPoint.marker.position.lat() == location.lat() && wayPoint.marker.position.lng() == location.lng()) {
                    return wayPoint;
                }
            }
            return null;
        };
        /**
         * Remove a waypoint from list and databae
         */
        WayPointsManager.prototype.remove = function (wayPoint, fn) {
            var _this = this;
            wayPoint.remove(function (wPoint) {
                // Remove waypoint from list
                _this.wayPointsList.remove(wPoint);
                if ($.isFunction(fn)) {
                    fn.call(_this, wPoint);
                }
            });
        };
        /**
         * List waypoints from database
         */
        WayPointsManager.prototype.list = function (fn) {
            var _this = this;
            new trackinexercise.models.WayPoint().list(function (data) {
                $.each(data, function (n, waypointJson) {
                    _this.wayPointsList.push(new trackinexercise.models.WayPoint(waypointJson));
                });
                if ($.isFunction(fn)) {
                    fn.call(_this, _this.all());
                }
            });
        };
        return WayPointsManager;
    }());
    trackinexercise.WayPointsManager = WayPointsManager;
})(trackinexercise || (trackinexercise = {}));
/// <reference path="../models/WayPoint.cls.ts"/>
var trackinexercise;
(function (trackinexercise) {
    var GMap = /** @class */ (function () {
        function GMap() {
            this.roads = [];
        }
        GMap.prototype.initMap = function () {
            // San Francisco
            var sf = { lat: 37.774929, lng: -122.419416 };
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10,
                center: sf
            });
            this.map = map;
            return map;
        };
        GMap.prototype.createRoadObject = function (directions) {
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
                    map: this.map,
                    polylineOptions: polylineOptions,
                    suppressMarkers: true
                });
                this.roads.push(road);
            }
        };
        GMap.prototype.cleanRoads = function () {
            for (var i = 0; i < this.roads.length; i++) {
                var road = this.roads[i];
                road.setMap(null);
            }
            this.roads = [];
        };
        GMap.prototype.addWayPointMarker = function (waypoint) {
            var _this = this;
            if (waypoint.marker) {
                return waypoint.marker;
            }
            var marker = new google.maps.Marker({
                position: { lat: parseFloat(waypoint.latitude), lng: parseFloat(waypoint.longitude) },
                map: this.map,
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
                if (_this.infoWindow) {
                    _this.infoWindow.close();
                }
                infoWindow.open(_this.map, marker);
                _this.infoWindow = infoWindow;
            });
            return marker;
        };
        GMap.prototype.centerizeWayPoint = function (wayPoint) {
            this.map.panTo(wayPoint.marker.position);
            if (this.map.getZoom() < 12) {
                this.map.setZoom(12);
            }
        };
        GMap.prototype.drawRoute = function (wayPoints, optimize, fn) {
            var _this = this;
            if (optimize === void 0) { optimize = false; }
            if (!wayPoints || wayPoints.length < 2) {
                return;
            }
            app.calculatingRoute(true);
            // Copy waypoints array
            var wayPointsRoute = [].concat(wayPoints);
            var fromWayPoint = wayPointsRoute.shift();
            var toWayPoint = wayPointsRoute.pop();
            var wayPointsMapped = wayPointsRoute.map(function (wayPoint) {
                return {
                    location: wayPoint.marker.position,
                    stopover: true
                };
            });
            var request = {
                origin: fromWayPoint.marker.position,
                destination: toWayPoint.marker.position,
                waypoints: wayPointsMapped,
                optimizeWaypoints: optimize,
                provideRouteAlternatives: true,
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                travelMode: google.maps.TravelMode.DRIVING
            };
            // populate your box/field with lat, lng
            this.directionsService.route(request, function (directions, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    _this.createRoadObject(directions);
                    if ($.isFunction(fn)) {
                        fn.call(directions, directions, wayPointsRoute);
                    }
                }
                app.calculatingRoute(false);
            });
        };
        GMap.prototype.initGMap = function () {
            this.directionsService = new google.maps.DirectionsService();
            var map = this.initMap();
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
                    var wayPoint = new trackinexercise.models.WayPoint(place.name);
                    wayPoint.setCoordinates(place.geometry.location.lat(), place.geometry.location.lng());
                    app.addWayPoint(wayPoint);
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
        };
        return GMap;
    }());
    trackinexercise.GMap = GMap;
})(trackinexercise || (trackinexercise = {}));
/// <reference path="WayPointsManager.cls.ts"/>
/// <reference path="GMap.cls.ts"/>
var trackinexercise;
(function (trackinexercise) {
    var MESSAGES = [
        "Use the address bar on the top to add a new delivery stop",
        "Use drag & drop to modify stop order",
        "Double-click on the delivery stop icon to change the delivery type (pickup or drop-off)",
        "Click on 'Optimize' button to optimize the route"
    ];
    /**
     * Main application class
     */
    var App = /** @class */ (function () {
        /**
         * Constructor
         */
        function App(gMap) {
            // Waypoints manager
            this.wayPoints = new trackinexercise.WayPointsManager();
            // Drivers
            this.driversList = ko.observableArray();
            // Message trigger
            this.calculatingRoute = ko.observable(false);
            /**
             * Index of the current message to show
             */
            this.messageIndex = 0;
            this.gMap = gMap;
            this.calculatingRoute.subscribe(function (b) {
                if (b) {
                    $('#progress_route').fadeIn('slow');
                }
                else {
                    $('#progress_route').fadeOut('slow');
                }
            });
        }
        /**
         * Initialization
         */
        App.prototype.init = function () {
            this.gMap.initGMap();
            this.retrieveWayPointList();
            this.retrieveDriverList();
        };
        /**
         * Add new waypoint to tour
         */
        App.prototype.addWayPoint = function (wayPoint) {
            var _this = this;
            this.wayPoints.create(wayPoint, function () {
                // Add marker
                _this.gMap.addWayPointMarker(wayPoint);
                // Draw roads
                _this.drawWayPointsRoads();
            });
        };
        /**
         * Remove waypoint from tour
         */
        App.prototype.removeWayPoint = function (wayPoint) {
            var _this = this;
            this.wayPoints.remove(wayPoint, function () {
                wayPoint.marker = null;
                // Redraw roads (could be optimized)
                _this.drawWayPointsRoads();
            });
        };
        /**
         * Retrieve waypoints from tour
         */
        App.prototype.retrieveWayPointList = function () {
            var _this = this;
            this.wayPoints.list(function (wayPoints) {
                // Add markers
                $.each(wayPoints, function (k, wayPoint) {
                    _this.gMap.addWayPointMarker(wayPoint);
                });
                // Draw roads
                _this.drawWayPointsRoads();
                $('#waypoints > ul').sortable({
                    update: function (event, ui) {
                        _this.updateWayPointsPositions();
                    }
                });
            });
        };
        /**
         * Retrieve drivers
         */
        App.prototype.retrieveDriverList = function (fn) {
            var _this = this;
            new trackinexercise.models.Driver().list(function (data) {
                var drivers = [];
                $.each(data, function (n, driverJson) {
                    drivers.push(new trackinexercise.models.Driver(driverJson));
                });
                _this.driversList(drivers);
                if ($.isFunction(fn)) {
                    fn.call(_this, _this.driversList());
                }
            });
        };
        /**
         * Center map on entire tour
         */
        App.prototype.centerBounds = function () {
            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            var wayPoints = this.wayPoints.all();
            for (var i = 0; i < wayPoints.length; i++) {
                var wayPoint = wayPoints[i];
                bounds.extend(wayPoint.marker.position);
            }
            this.gMap.map.fitBounds(bounds);
        };
        /**
         * Draw routes
         */
        App.prototype.drawWayPointsRoads = function (optimize) {
            var _this = this;
            if (optimize === void 0) { optimize = false; }
            this.gMap.cleanRoads();
            var wayPointsData = this.wayPoints.all();
            if (wayPointsData.length == 0) {
                return;
            }
            // First waypoint
            wayPointsData[0].duration(0);
            wayPointsData[0].distance(0);
            this.gMap.drawRoute(wayPointsData, optimize, function (directions, wayPointsMapped) {
                var wayPointsList = [];
                wayPointsList.push(wayPointsData[0]);
                for (var i = 0; i < directions.routes[0].legs.length; i++) {
                    var duration = directions.routes[0].legs[i].duration.value;
                    var distance = directions.routes[0].legs[i].distance.value;
                    var newOrder = directions.routes[0].waypoint_order[i];
                    // Retrieve new waypoint order
                    var wayPoint = wayPointsMapped[newOrder];
                    if (!wayPoint) {
                        // Last waypoint
                        newOrder = wayPointsData.length - 1;
                        wayPoint = wayPointsData[newOrder];
                    }
                    wayPoint.duration(duration);
                    wayPoint.distance(distance);
                    if (wayPoint.position != i + 1) {
                        // Save new wayPoint position
                        wayPoint.position = i + 1;
                        wayPoint.save();
                    }
                    wayPointsList.push(wayPoint);
                }
                // Update waypoint order
                _this.wayPoints.wayPointsList([]);
                _this.wayPoints.wayPointsList(wayPointsList);
            });
        };
        /**
         * Update and save waypoints position into list
         */
        App.prototype.updateWayPointsPositions = function () {
            var wPoints = [];
            // Could be optimized to save new ordre with one transaction
            $('#waypoints > ul > li').each(function () {
                var $item = $(this);
                var wayPoint = ko.dataFor(this);
                if (wayPoint.position != $item.index()) {
                    wayPoint.position = $item.index();
                    wayPoint.save();
                }
                wPoints.push(wayPoint);
            });
            // Update waypoint list order
            this.wayPoints.wayPointsList(wPoints);
            // Redraw roads (could be optimized)
            this.drawWayPointsRoads();
        };
        /**
         * Toast a user message
         */
        App.prototype.toast = function (text, title) {
            if (title === void 0) { title = "Quentin says "; }
            iziToast.show({
                theme: 'dark',
                position: 'bottom',
                balloon: true,
                title: title,
                timeout: 7000,
                message: text,
                layout: 1,
                target: '#trackin_message_area'
            });
        };
        /**
         *
         */
        App.prototype.talk = function () {
            var message = MESSAGES[this.messageIndex++];
            if (this.messageIndex >= MESSAGES.length) {
                this.messageIndex = 0;
            }
            this.toast(message, 'Need help ?');
        };
        return App;
    }());
    trackinexercise.App = App;
})(trackinexercise || (trackinexercise = {}));
// <reference path="./types/jquery/index.d.ts"/>
/// <reference path="./types/knockout/index.d.ts"/>
/// <reference path="./classes/commons/APIResourceInterface.cls.ts"/>
/// <reference path="./classes/commons/API.cls.ts"/>
/// <reference path="./models/WayPoint.cls.ts"/>
/// <reference path="./models/Driver.cls.ts"/>
/// <reference path="./classes/WayPointsManager.cls.ts"/>
/// <reference path="./classes/GMap.cls.ts"/>
/// <reference path="./classes/App.cls.ts"/>
var GMap = trackinexercise.GMap;
var App = trackinexercise.App;
var gmap = new GMap();
var app = new App(gmap);
// JQuery load on ready
$(function () {
    app.toast("Welcome !");
    ko.applyBindings(app);
});
function onMapLoaded() {
    app.init();
}
