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
        /**
         * Use this class to simplify REST request
         */
        var API = /** @class */ (function () {
            function API(uri) {
                this.uri = uri;
            }
            /**
             * Returne API uri
             */
            API.prototype.getUri = function () {
                return this.uri;
            };
            /**
             * Execute a POST request
             */
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
            /**
             * Execute a PUT request
             */
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
            /**
             * Execute a DELETE request
             */
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
            /**
             * Execute a GET request
             */
            API.prototype.load = function (id, fn) {
                var _this = this;
                $.getJSON(this.uri + '/' + id).done(function (data) {
                    _this.fromJson(data);
                    if ($.isFunction(fn)) {
                        fn.call(_this, data);
                    }
                });
            };
            /**
             * Execute a GET request
             */
            API.prototype.list = function (fn) {
                var _this = this;
                $.getJSON(this.uri).done(function (data) {
                    if ($.isFunction(fn)) {
                        fn.call(_this, data);
                    }
                });
            };
            /**
             * Execute a GET request for a sub operation resource
             */
            API.prototype.sublist = function (operation, fn) {
                var _this = this;
                $.getJSON(this.uri + '/' + this.id + '/' + operation).done(function (data) {
                    if ($.isFunction(fn)) {
                        fn.call(_this, data);
                    }
                });
            };
            /**
             * Save data depending on id
             * No id => create
             * id => update
             * id = -1 => remove
             */
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
                    return Math.round(distance / models.MILE * 100) / 100;
                }).extend({ throttle: 100 });
                // Auto convert duration into seconds
                _this.durationInMinutes = ko.computed(function () {
                    var duration = _this.duration();
                    return Math.round(duration / 60);
                }).extend({ throttle: 100 });
                _this.type.subscribe(function () {
                    if (_this.marker) {
                        _this.marker.setIcon({
                            url: _this.getIcon(),
                            scaledSize: new google.maps.Size(35, 35)
                        });
                    }
                });
                return _this;
            }
            /**
             * Return waypoint icon
             */
            WayPoint.prototype.getIcon = function () {
                switch (this.type()) {
                    case 0: return 'resources/assets/images/market.png';
                    case 1: return 'resources/assets/images/dropoff-icon.png';
                    case 2: return 'resources/assets/images/pickup-icon.png';
                }
            };
            // Return waypoint data
            WayPoint.prototype.data = function () {
                return {
                    id: this.id,
                    label: this.label,
                    latitude: this.latitude,
                    longitude: this.longitude,
                    position: this.position,
                    tourId: this.tourId,
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
                this.tourId = json.tourId;
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
            /**
             * Return driver firstName and lastName
             */
            Driver.prototype.fullName = function () {
                return this.firstName + ' ' + this.lastName;
            };
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
    var models;
    (function (models) {
        models.MILE = 1609.344;
        /**
         * Class used to manage waypoints list
         */
        var Tour = /** @class */ (function (_super) {
            __extends(Tour, _super);
            /**
             * Constructor
             */
            function Tour(json) {
                var _this = _super.call(this, Tour.API) || this;
                // Extra
                _this.wayPoints = ko.observableArray();
                _this.globalDuration = ko.observable();
                _this.globalDistance = ko.observable();
                if (typeof (json) == 'object') {
                    _this.fromJson(json);
                }
                _this._computed = ko.computed(function () {
                    var wPoints = _this.wayPoints();
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
                _this.distanceInMiles = ko.computed(function () {
                    var distance = _this.globalDistance();
                    return Math.round(distance / models.MILE * 100) / 100;
                }).extend({ throttle: 100 });
                _this.durationInMinutes = ko.computed(function () {
                    var duration = _this.globalDuration();
                    return Math.round(duration / 60);
                }).extend({ throttle: 100 });
                return _this;
            }
            // Return route data
            Tour.prototype.data = function () {
                return {
                    id: this.id,
                    driverId: this.driverId
                };
            };
            // Set driver data from json
            Tour.prototype.fromJson = function (json) {
                this.id = json.id;
                this.driverId = json.driverId;
            };
            // Add waypoint to the route
            Tour.prototype.push = function (wayPoint, fn) {
                var _this = this;
                var wayPoints = this.all();
                // Autoset position
                wayPoint.position = wayPoints.length;
                // Autoset type to drop-off
                wayPoint.type(2);
                // Autoset tour id
                wayPoint.tourId = this.id;
                // Save to database
                wayPoint.save(function (wPoint) {
                    _this.wayPoints.push(wPoint);
                    if ($.isFunction(fn)) {
                        fn.call(_this, wPoint);
                    }
                });
            };
            /**
             * Return all the waypoints
             */
            Tour.prototype.all = function () {
                return this.wayPoints();
            };
            /**
             * Remove a waypoint from list and database
             */
            Tour.prototype.detach = function (wayPoint, fn) {
                var _this = this;
                wayPoint.remove(function (wPoint) {
                    // Remove waypoint from list
                    _this.wayPoints.remove(wPoint);
                    if ($.isFunction(fn)) {
                        fn.call(_this, wPoint);
                    }
                });
            };
            /**
             * List waypoints from database
             */
            Tour.prototype.loadWayPoints = function (fn) {
                var _this = this;
                this.sublist('waypoints', function (data) {
                    $.each(data, function (n, waypointJson) {
                        _this.wayPoints.push(new models.WayPoint(waypointJson));
                    });
                    if ($.isFunction(fn)) {
                        fn.call(_this, _this.all());
                    }
                });
            };
            Tour.API = "api/tours";
            return Tour;
        }(trackinexercise.commons.API));
        models.Tour = Tour;
    })(models = trackinexercise.models || (trackinexercise.models = {}));
})(trackinexercise || (trackinexercise = {}));
/// <reference path="../models/WayPoint.cls.ts"/>
var trackinexercise;
(function (trackinexercise) {
    var GMap = /** @class */ (function () {
        function GMap() {
            this.roads = [];
        }
        /**
         * Initialize map and center San Francisco city ;)
         */
        GMap.prototype.initMap = function (startPosition) {
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10,
                center: startPosition
            });
            this.map = map;
            return map;
        };
        /**
         * Create route from directions
         */
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
        /**
         * Clean roads
         */
        GMap.prototype.cleanRoads = function () {
            for (var i = 0; i < this.roads.length; i++) {
                var road = this.roads[i];
                road.setMap(null);
            }
            this.roads = [];
        };
        /**
         * Add a marker at a waypoint position
         */
        GMap.prototype.addWayPointMarker = function (waypoint) {
            var _this = this;
            if (waypoint.marker) {
                return waypoint.marker;
            }
            var marker = new google.maps.Marker({
                position: { lat: parseFloat(waypoint.latitude), lng: parseFloat(waypoint.longitude) },
                map: this.map,
                icon: {
                    url: waypoint.getIcon(),
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
        /**
         * Centerize map on waypoints route bounds
         */
        GMap.prototype.centerizeWayPoint = function (wayPoint) {
            this.map.panTo(wayPoint.marker.position);
            if (this.map.getZoom() < 12) {
                this.map.setZoom(12);
            }
        };
        /**
         * Calculate and draw route between waypoints
         */
        GMap.prototype.drawRoute = function (wayPoints, optimize, fn) {
            var _this = this;
            if (optimize === void 0) { optimize = false; }
            if (!wayPoints || wayPoints.length < 2) {
                return;
            }
            app.calculatingRoute(true);
            // Copy waypoints array
            var wayPointsRoute = [].concat(wayPoints);
            var fromWayPoint = app.shopAddress();
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
        /**
         * Callback from google load
         */
        GMap.prototype.initGMap = function (fn) {
            var _this = this;
            this.directionsService = new google.maps.DirectionsService();
            app.resolveLocation(function (position) {
                var wayPoint = new trackinexercise.models.WayPoint("My shop");
                wayPoint.setCoordinates(position.lat, position.lng);
                wayPoint.type(0);
                app.shopAddress(wayPoint);
                // Init map and center to location
                var map = _this.initMap(position);
                // Add shop waypoint
                _this.addWayPointMarker(wayPoint);
                fn.call(_this);
            });
        };
        /**
         * Create a search box
         */
        GMap.prototype.createSearchBox = function (input) {
            var _this = this;
            // Create the search box and link it to the UI element.
            var searchBox = new google.maps.places.SearchBox(input);
            // Bias the SearchBox results towards current map's viewport.
            this.map.addListener('bounds_changed', function () {
                searchBox.setBounds(_this.map.getBounds());
            });
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', function () {
                var places = searchBox.getPlaces();
                if (places.length == 0) {
                    return;
                }
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
                    input.value = '';
                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    }
                    else {
                        bounds.extend(place.geometry.location);
                    }
                });
                _this.map.fitBounds(bounds);
            });
        };
        return GMap;
    }());
    trackinexercise.GMap = GMap;
})(trackinexercise || (trackinexercise = {}));
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
            // Current Tour
            this.currentTour = ko.observable();
            // Drivers
            this.drivers = ko.observableArray();
            // Message trigger
            this.calculatingRoute = ko.observable(false);
            // Waiting
            this.waitingFor = ko.observable(false);
            // Shop address (should come from database by that's ok for the demo)
            this.shopAddress = ko.observable();
            // Current driver selection
            this.selectedDriver = ko.observable();
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
         * Update current tour driver
         */
        App.prototype.updateTourDriver = function (driver) {
            this.selectedDriver(driver);
            this.currentTour().driverId = driver.id;
            this.currentTour().save();
        };
        /**
         * Initialization
         */
        App.prototype.init = function () {
            var _this = this;
            this.gMap.initGMap(function () {
                _this.retrieveDriverList(function () {
                    _this.retrieveCurrentRoute(function () {
                        // Prepare google search box
                        _this.gMap.createSearchBox(document.getElementById('main-search-input'));
                        _this.gMap.createSearchBox(document.getElementById('tour-search-input'));
                        // Show HMI with animation
                        _this.initUXAnimationSequence();
                    });
                });
            });
        };
        /**
         * Initialise HMI animation
         */
        App.prototype.initUXAnimationSequence = function () {
            var _this = this;
            setTimeout(function () {
                $('#main-search-box').addClass('animated slideInDown');
            }, 1000);
            setTimeout(function () {
                $('#trackin_support').addClass('animated fadeIn');
                _this.toast("Welcome ! Need help ? Click on me !");
            }, 1500);
            setTimeout(function () {
                $('#tour').addClass('animated slideInRight');
            }, 2000);
            $(".nano").nanoScroller();
            $("[title]").tooltipster();
        };
        /**
         * Add new waypoint to tour
         */
        App.prototype.addWayPoint = function (wayPoint) {
            var _this = this;
            this.currentTour().push(wayPoint, function () {
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
            this.currentTour().detach(wayPoint, function () {
                wayPoint.marker.setMap(null);
                wayPoint.marker = null;
                // Redraw roads (could be optimized)
                _this.drawWayPointsRoads();
            });
        };
        /**
         * Retrieve waypoints from tour
         */
        App.prototype.retrieveCurrentRoute = function (fn) {
            var _this = this;
            new trackinexercise.models.Tour().list(function (data) {
                // Note : for the demo, only one route
                var tour = new trackinexercise.models.Tour(data[0]);
                _this.currentTour(tour);
                _this.selectedDriver(_this.getDriverById(tour.driverId));
                _this.currentTour().loadWayPoints(function (wayPoints) {
                    // Add markers
                    $.each(wayPoints, function (k, wayPoint) {
                        _this.gMap.addWayPointMarker(wayPoint);
                    });
                    // Draw roads
                    _this.drawWayPointsRoads();
                    $('#waypoints ul.sortable').sortable({
                        update: function (event, ui) {
                            _this.updateWayPointsPositions();
                        }
                    });
                });
                fn.call(_this);
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
                _this.drivers(drivers);
                if ($.isFunction(fn)) {
                    fn.call(_this, _this.drivers());
                }
            });
        };
        /**
         * Search a driver by is id
         */
        App.prototype.getDriverById = function (id) {
            var drivers = this.drivers();
            for (var i = 0; i < drivers.length; i++) {
                var driver = drivers[i];
                if (driver.id == id) {
                    return driver;
                }
            }
            return null;
        };
        /**
         * Center map on entire tour
         */
        App.prototype.centerBounds = function () {
            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            var wayPoints = this.currentTour().all();
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
            var wayPointsData = this.currentTour().all();
            if (wayPointsData.length == 0) {
                return;
            }
            this.gMap.drawRoute(wayPointsData, optimize, function (directions, wayPointsMapped) {
                var wayPointsList = [];
                for (var i = 0; i < directions.routes[0].legs.length; i++) {
                    var duration_1 = directions.routes[0].legs[i].duration.value;
                    var distance = directions.routes[0].legs[i].distance.value;
                    var newOrder = directions.routes[0].waypoint_order[i];
                    // Retrieve new waypoint order
                    var wayPoint = wayPointsMapped[newOrder];
                    if (!wayPoint) {
                        // Last waypoint
                        newOrder = wayPointsData.length - 1;
                        wayPoint = wayPointsData[newOrder];
                    }
                    wayPoint.duration(duration_1);
                    wayPoint.distance(distance);
                    if (wayPoint.position != i + 1) {
                        // Save new wayPoint position
                        wayPoint.position = i + 1;
                        wayPoint.save();
                    }
                    wayPointsList.push(wayPoint);
                }
                // Get global duration to calculate gain
                var duration = _this.currentTour().durationInMinutes();
                // Update waypoint order
                _this.currentTour().wayPoints([]);
                _this.currentTour().wayPoints(wayPointsList);
                if (duration != 0) {
                    // Get global duration to calculate gain
                    setTimeout(function () {
                        var minutesDiff = duration - _this.currentTour().durationInMinutes();
                        // Toast a message
                        if (optimize) {
                            if (minutesDiff > 0) {
                                _this.toast("Well done ! Tour has been optimized (<span class=\"green\">" + minutesDiff + " minutes</span> saved) !");
                            }
                            else {
                                _this.toast("All right ! Tour is already optimized");
                            }
                        }
                        else {
                            if (minutesDiff != 0) {
                                if (minutesDiff > 0) {
                                    // Tour is shorter
                                    _this.toast("Tour has been updated (<span class=\"green\">" + -minutesDiff + "</span> minutes)");
                                }
                                else {
                                    // Tour is longer
                                    _this.toast("Tour has been updated (+" + -minutesDiff + "  minutes)");
                                }
                            }
                        }
                    }, 500); // use timeout because of throttle delay of durationInMinutes() calculation
                }
            });
        };
        /**
         * Update and save waypoints position into list
         */
        App.prototype.updateWayPointsPositions = function () {
            var wPoints = [];
            // Could be optimized to save new ordre with one transaction
            $('#waypoints ul.sortable > li').each(function () {
                var $item = $(this);
                var wayPoint = ko.dataFor(this);
                if (wayPoint.position != $item.index()) {
                    wayPoint.position = $item.index();
                    wayPoint.save();
                }
                wPoints.push(wayPoint);
            });
            // Update waypoint list order
            this.currentTour().wayPoints(wPoints);
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
         * Rotate user message and toast it
         */
        App.prototype.talk = function () {
            var message = MESSAGES[this.messageIndex++];
            if (this.messageIndex >= MESSAGES.length) {
                this.messageIndex = 0;
            }
            this.toast(message, 'Need help ?');
        };
        /**
         * Resolve current user location
         */
        App.prototype.resolveLocation = function (fn) {
            var _this = this;
            // San Francisco
            var defaultLocation = { lat: 37.774929, lng: -122.419416 };
            if (navigator.geolocation) {
                var options = {
                    enableHighAccuracy: true,
                    timeout: 3000,
                    maximumAge: 0
                };
                navigator.geolocation.getCurrentPosition(function (pos) {
                    var location = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    };
                    fn.call(_this, location);
                }, function () {
                    fn.call(_this, defaultLocation);
                }, options);
            }
            else {
                fn.call(this, defaultLocation);
            }
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
/// <reference path="./models/Tour.cls.ts"/>
/// <reference path="./classes/GMap.cls.ts"/>
/// <reference path="./classes/App.cls.ts"/>
var GMap = trackinexercise.GMap;
var App = trackinexercise.App;
var gmap = new GMap();
var app = new App(gmap);
// JQuery load on ready
$(function () {
    ko.applyBindings(app);
});
function onMapLoaded() {
    app.init();
}
