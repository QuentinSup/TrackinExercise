/// <reference path="../models/WayPoint.cls.ts"/>

module trackinexercise {

    export class GMap {

        public directionsService: any;
        public map: any;
        public infoWindow: any;
        public roads = [];

        /**
         * Initialize map and center San Francisco city ;)
         */
        private initMap(startPosition: any): void {

            let map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10,
                center: startPosition
            });

            this.map = map;

            return map;
        }

        /**
         * Create route from directions
         */
        public createRoadObject(directions): void {

            for (let i = 0; i < directions.routes.length; i++) {

                // Define a symbol using SVG path notation, with an opacity.
                let lineSymbol: any = {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: .5,
                    scale: 4
                };

                let polylineOptions = i == 0 ? null : new google.maps.Polyline({
                    strokeColor: '#101010',
                    strokeOpacity: 0.2,
                    strokeWeight: 5,
                    icons: [{
                        icon: lineSymbol,
                        offset: '0',
                        repeat: '20px'
                    }],
                });

                let road: any = new google.maps.DirectionsRenderer({
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

        }

        /**
         * Clean roads
         */
        public cleanRoads(): void {
            for (let i = 0; i < this.roads.length; i++) {
                let road = this.roads[i];
                road.setMap(null);
            }
            this.roads = [];
        }

        /**
         * Add a marker at a waypoint position
         */
        public addWayPointMarker(waypoint: models.WayPoint): void {

            if (waypoint.marker) {
                return waypoint.marker;
            }

            let marker = new google.maps.Marker({
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

            let infoWindow = new google.maps.InfoWindow({
                content: '<strong>' + waypoint.label + '</strong> '
            });

            waypoint.infoWindow = infoWindow;

            marker.addListener('click', (): void => {

                if (this.infoWindow) {
                    this.infoWindow.close();
                }

                infoWindow.open(this.map, marker);

                this.infoWindow = infoWindow;

            });

            return marker;
        }

        /**
         * Centerize map on waypoints route bounds
         */
        public centerizeWayPoint(wayPoint: models.WayPoint): void {
            this.map.panTo(wayPoint.marker.position);
            if (this.map.getZoom() < 12) {
                this.map.setZoom(12);
            }
        }

        /**
         * Calculate and draw route between waypoints
         */
        public drawRoute(wayPoints: models.WayPoint[], optimize: boolean = false, fn?: Function): void {

            if (!wayPoints || wayPoints.length == 0) {
                return;
            }

            app.calculatingRoute(true);

            // Copy waypoints array
            let wayPointsRoute: models.WayPoint[] = [].concat(wayPoints);
            let fromWayPoint: models.WayPoint = app.shopAddress();
            let toWayPoint: models.WayPoint = wayPointsRoute.pop();

            let wayPointsMapped: any = wayPointsRoute.map(function(wayPoint: models.WayPoint) {
                return {
                    location: wayPoint.marker.position,
                    stopover: true
                };
            });


            let request = {
                origin: fromWayPoint.marker.position,
                destination: toWayPoint.marker.position,
                waypoints: wayPointsMapped,
                optimizeWaypoints: optimize,
                provideRouteAlternatives: true,
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                travelMode: google.maps.TravelMode.DRIVING
            };

            // populate your box/field with lat, lng
            this.directionsService.route(request, (directions, status): void => {
                if (status == google.maps.DirectionsStatus.OK) {

                    this.createRoadObject(directions);
                    if ($.isFunction(fn)) {
                        fn.call(directions, directions, wayPointsRoute);
                    }
                }

                app.calculatingRoute(false);

            });
        }

        /**
         * Callback from google load
         */
        public initGMap(fn: Function): void {

            this.directionsService = new google.maps.DirectionsService();

            app.resolveLocation((position: any): void => {

                let wayPoint: models.WayPoint = new models.WayPoint("My shop");
                wayPoint.setCoordinates(position.lat, position.lng);
                wayPoint.type(0);
                app.shopAddress(wayPoint);

                // Init map and center to location
                let map: any = this.initMap(position);
                
                // Add shop waypoint
                this.addWayPointMarker(wayPoint);
                
                fn.call(this);
     
            });


        }

        /**
         * Create a search box
         */
        public createSearchBox(input: any): void {
            
            // Create the search box and link it to the UI element.
            let searchBox = new google.maps.places.SearchBox(input);

            // Bias the SearchBox results towards current map's viewport.
            this.map.addListener('bounds_changed', (): void => {
                searchBox.setBounds(this.map.getBounds());
            });

            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', (): void => {

                let places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                // For each place, get the icon, name and location.
                let bounds = new google.maps.LatLngBounds();
                places.forEach((place): void => {
                    
                    if (!place.geometry) {
                        console.log("Returned place contains no geometry");
                        return;
                    }
                    let icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    let wayPoint: models.WayPoint = new models.WayPoint(place.name);
                    wayPoint.setCoordinates(place.geometry.location.lat(), place.geometry.location.lng());
                    app.addWayPoint(wayPoint);

                    input.value = '';

                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                this.map.fitBounds(bounds);
            });
        }

    }

}