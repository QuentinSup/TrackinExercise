/// <reference path="GMap.cls.ts"/>

module trackinexercise {

    declare var iziToast;

    const MESSAGES: string[] = [
        "Use the address bar on the top to add a new delivery stop",
        "Use drag & drop to modify stop order",
        "Double-click on the delivery stop icon to change the delivery type (pickup or drop-off)",
        "Click on 'Optimize' button to optimize the route"
    ];


    /**
     * Main application class
     */
    export class App {

        // GMap instance
        public gMap: GMap;
        // Current Tour
        public currentTour: KnockoutObservable<models.Tour> = ko.observable<models.Tour>();
        // Drivers
        public drivers: KnockoutObservableArray<models.Driver> = ko.observableArray<models.Driver>();

        // Message trigger
        public calculatingRoute: KnockoutObservable<boolean> = ko.observable<boolean>(false);

        // Waiting
        public waitingFor: KnockoutObservable<boolean> = ko.observable<boolean>(false);

        // Shop address (should come from database by that's ok for the demo)
        public shopAddress: KnockoutObservable<models.WayPoint> = ko.observable<models.WayPoint>();

        // Current driver selection
        public selectedDriver: KnockoutObservable<models.Driver> = ko.observable<models.Driver>();

        /**
         * Index of the current message to show
         */
        private messageIndex = 0;

        /**
         * Constructor
         */
        constructor(gMap: GMap) {
            this.gMap = gMap;

            this.calculatingRoute.subscribe((b: boolean): void => {
                if (b) {
                    $('#progress_route').fadeIn('slow');
                } else {
                    $('#progress_route').fadeOut('slow');
                }
            });

        }

        /**
         * Update current tour driver
         */
        public updateTourDriver(driver: models.Driver): void {

            this.selectedDriver(driver);
            this.currentTour().driverId = driver.id;
            this.currentTour().save((data): void => {
                this.toast("The driver " + driver.fullName() + " has been correctly assigned to the tour");    
            }, (): void => {
                this.toast("Oups ! Something wrong happened. Please refresh page.");    
            });

        }

        /**
         * Initialization
         */
        public init(): void {
            this.gMap.initGMap((): void => {

                this.retrieveDriverList((): void => {
                    this.retrieveCurrentRoute((): void => {

                        // Prepare google search box
                        this.gMap.createSearchBox(document.getElementById('main-search-input'));
                        this.gMap.createSearchBox(document.getElementById('tour-search-input'));

                        // Show HMI with animation
                        this.initUXAnimationSequence();

                    });
                });

            });
        }

        /**
         * Initialise HMI animation
         */
        private initUXAnimationSequence(): void {

            setTimeout((): void => {
                $('#main-search-box').addClass('animated slideInDown');
            }, 1000);

            setTimeout((): void => {
                $('#trackin_support').addClass('animated fadeIn');
                this.toast("Welcome ! Need help ? Click on me !");
            }, 1500);

            setTimeout((): void => {
                $('#tour').addClass('animated slideInRight');
            }, 2000);
            
            setTimeout((): void => {
                try {
                    $("[title]").tooltipster();
                    $(".nano").nanoScroller();
                } catch(e) { 
                    //silent 
                }
            }, 100);
            
        }

        /**
         * Add new waypoint to tour
         */
        public addWayPoint(wayPoint: models.WayPoint): void {
            this.currentTour().push(wayPoint, (): void => {

                // Show success
                this.toast("New waypoint has been correctly assigned to the tour");
                
                // Add marker
                this.gMap.addWayPointMarker(wayPoint);

                // Draw roads
                this.drawWayPointsRoads();
            }, (): void => {
                this.toast("Oups ! Something wrong happened. Please refresh page.");    
            });
        }

        /**
         * Remove waypoint from tour
         */
        public removeWayPoint(wayPoint: models.WayPoint): void {
            this.currentTour().detach(wayPoint, (): void => {

                // Show success
                this.toast("Waypoint has been correctly removed from the tour");
                
                wayPoint.marker.setMap(null);
                wayPoint.marker = null;

                // Redraw roads (could be optimized)
                this.drawWayPointsRoads();
            }, (): void => {
                this.toast("Oups ! Something wrong happened. Please refresh page.");    
            });
        }

        /**
         * Retrieve waypoints from tour
         */
        public retrieveCurrentRoute(fn: Function): void {

            new models.Tour().list((data: any): void => {

                // Note : for the demo, only one route
                let tour: models.Tour = new models.Tour(data[0]);

                this.currentTour(tour);
                this.selectedDriver(this.getDriverById(tour.driverId));
                this.currentTour().loadWayPoints((wayPoints: models.WayPoint[]): void => {

                    // Add markers
                    $.each(wayPoints, (k, wayPoint: models.WayPoint): void => {
                        this.gMap.addWayPointMarker(wayPoint);
                    });

                    // Draw roads
                    this.drawWayPointsRoads();

                    $('#waypoints ul.sortable').sortable({
                        update: (event, ui): void => {
                            this.updateWayPointsPositions();
                        }
                    });

                });

                fn.call(this);
            });
        }

        /**
         * Retrieve drivers
         */
        public retrieveDriverList(fn?: Function): void {

            new models.Driver().list((data): void => {

                let drivers: models.Driver[] = [];

                $.each(data, (n, driverJson): void => {
                    drivers.push(new models.Driver(driverJson));
                });

                this.drivers(drivers);

                if ($.isFunction(fn)) {
                    fn.call(this, this.drivers());
                }

            });

        }

        /**
         * Search a driver by is id
         */
        public getDriverById(id: number): models.Driver {
            let drivers: models.Driver[] = this.drivers();
            for (let i = 0; i < drivers.length; i++) {
                let driver: models.Driver = drivers[i];
                if (driver.id == id) {
                    return driver;
                }
            }
            return null;
        }

        /**
         * Center map on entire tour
         */
        public centerBounds(): void {
            // For each place, get the icon, name and location.
            let bounds = new google.maps.LatLngBounds();
            let wayPoints: models.WayPoint[] = this.currentTour().all();

            bounds.extend(this.shopAddress().marker.position);
            
            for (let i = 0; i < wayPoints.length; i++) {
                let wayPoint: models.WayPoint = wayPoints[i];
                bounds.extend(wayPoint.marker.position);
            }

            this.gMap.map.fitBounds(bounds);
        }

        /**
         * Draw routes
         */
        public drawWayPointsRoads(optimize: boolean = false): void {

            this.gMap.cleanRoads();

            let wayPointsData: models.WayPoint[] = this.currentTour().all();

            if (wayPointsData.length == 0) {
                return;
            }

            this.gMap.drawRoute(wayPointsData, optimize, (directions: any, wayPointsMapped: models.WayPoint[]): void => {
                let wayPointsList: models.WayPoint[] = [];
                for (let i = 0; i < directions.routes[0].legs.length; i++) {

                    let duration: number = directions.routes[0].legs[i].duration.value;
                    let distance: number = directions.routes[0].legs[i].distance.value;
                    let newOrder: number = directions.routes[0].waypoint_order[i];

                    // Retrieve new waypoint order
                    let wayPoint: models.WayPoint = wayPointsMapped[newOrder];
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

                // Get global duration to calculate gain
                let duration: number = this.currentTour().durationInMinutes();

                // Update waypoint order
                this.currentTour().wayPoints([]);
                this.currentTour().wayPoints(wayPointsList);

                if (duration != 0) {
                    // Get global duration to calculate gain
                    setTimeout((): void => {

                        let minutesDiff = duration - this.currentTour().durationInMinutes();

                        // Toast a message
                        if (optimize) {
                            if (minutesDiff > 0) {
                                this.toast("Well done ! Tour has been optimized (<span class=\"green\">" + minutesDiff + " minutes</span> saved) !");
                            } else {
                                this.toast("All right ! Tour is already optimized");
                            }
                        } else {
                            if (minutesDiff != 0) {
                                if (minutesDiff > 0) {
                                    // Tour is shorter
                                    this.toast("Tour has been updated (<span class=\"green\">" + -minutesDiff + "</span> minutes)");
                                } else {
                                    // Tour is longer
                                    this.toast("Tour has been updated (+" + -minutesDiff + "  minutes)");
                                }
                            }
                        }
                    }, 500); // use timeout because of throttle delay of durationInMinutes() calculation
                }

            });

        }

        /**
         * Update and save waypoints position into list
         */
        private updateWayPointsPositions(): void {

            let wPoints: models.WayPoint[] = [];

            // Could be optimized to save new ordre with one transaction
            $('#waypoints ul.sortable > li').each(function() {
                let $item = $(this);
                let wayPoint = ko.dataFor(this);
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

        }

        /**
         * Toast a user message
         */
        public toast(text: string, title: string = "Quentin says "): void {
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
        }

        /**
         * Rotate user message and toast it
         */
        public talk(): void {
            let message: string = MESSAGES[this.messageIndex++];
            if (this.messageIndex >= MESSAGES.length) {
                this.messageIndex = 0;
            }
            this.toast(message, 'Need help ?');
        }

        /**
         * Resolve current user location
         */
        public resolveLocation(fn: Function): void {

            // San Francisco
            let defaultLocation = { lat: 37.774929, lng: -122.419416 };

            if (navigator.geolocation) {

                let options: any = {
                    enableHighAccuracy: true,
                    timeout: 3000,
                    maximumAge: 0
                };

                navigator.geolocation.getCurrentPosition((pos: any): void => {
                    let location = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    }
                    fn.call(this, location);
                }, (): void => {
                    fn.call(this, defaultLocation);
                }, options);
            } else {
                fn.call(this, defaultLocation);
            }
        }

    }

}