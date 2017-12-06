/// <reference path="WayPointsManager.cls.ts"/>
/// <reference path="GMap.cls.ts"/>

module trackinexercise {

    /**
     * Main application class
     */
    export class App {

        // GMap instance
        public gMap: GMap;
        // Waypoints manager
        public wayPoints: WayPointsManager = new WayPointsManager();
        // Drivers
        public driversList: KnockoutObservableArray<models.Driver> = ko.observableArray<models.Driver>();
        
        // Message trigger
        public calculatingRoute: KnockoutObservable<boolean> = ko.observable<boolean>(false);

        /**
         * Constructor
         */
        constructor(gMap: GMap) {
            this.gMap = gMap;

            this.calculatingRoute.subscribe((b: boolean): void => {
                if(b) {
                    $('#progress_route').fadeIn('slow');
                } else {
                    $('#progress_route').fadeOut('slow');    
                }
            });

        }
        
        /**
         * Initialization
         */
        public init(): void {
            this.gMap.initGMap();
            this.retrieveWayPointList();
            this.retrieveDriverList();
        }

        /**
         * Add new waypoint to tour
         */
        public addWayPoint(wayPoint: models.WayPoint): void {
            this.wayPoints.create(wayPoint, (): void => {

                // Add marker
                this.gMap.addWayPointMarker(wayPoint);

                // Draw roads
                this.drawWayPointsRoads();
            });


        }

        /**
         * Remove waypoint from tour
         */
        public removeWayPoint(wayPoint: models.WayPoint): void {
            this.wayPoints.remove(wayPoint, (): void => {

                wayPoint.marker = null;

                // Redraw roads (could be optimized)
                this.drawWayPointsRoads();
            });
        }

        /**
         * Retrieve waypoints from tour
         */
        public retrieveWayPointList(): void {

            this.wayPoints.list((wayPoints: models.WayPoint[]): void => {

                // Add markers
                $.each(wayPoints, (k, wayPoint: models.WayPoint): void => {
                    this.gMap.addWayPointMarker(wayPoint);
                });

                // Draw roads
                this.drawWayPointsRoads();

                $('#waypoints > ul').sortable({
                    update: (event, ui): void => {
                        this.updateWayPointsPositions();
                    }
                });

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
                
                this.driversList(drivers);

                if ($.isFunction(fn)) {
                    fn.call(this, this.driversList());
                }

            });
            
        }
        
        /**
         * Center map on entire tour
         */
        public centerBounds(): void {
            // For each place, get the icon, name and location.
            let bounds = new google.maps.LatLngBounds();
            let wayPoints: models.WayPoint[] = this.wayPoints.all();

            for (let i = 0; i < wayPoints.length; i++) {
                let wayPoint: models.WayPoint = wayPoints[i];
                bounds.extend(wayPoint.marker.position);
            }

            this.gMap.map.fitBounds(bounds);
        }

        /**
         * Draw routes
         */
        private drawWayPointsRoads(): void {

            this.gMap.cleanRoads();

            let waypointsData: models.WayPoint[] = this.wayPoints.all();

            if (waypointsData.length == 0) {
                return;
            }

            // First waypoint
            waypointsData[0].duration(0);
            waypointsData[0].distance(0);

            for (let i = 1; i < waypointsData.length; i++) {
                let wayPointFrom: models.WayPoint = waypointsData[i - 1];
                let wayPointTo: models.WayPoint = waypointsData[i];
                this.gMap.drawRoute(wayPointFrom.getCoordinates(), wayPointTo.getCoordinates(), function() {
                    let duration: number = this.routes[0].legs[0].duration.value;
                    let distance: number = this.routes[0].legs[0].distance.value;
                    wayPointTo.duration(duration);
                    wayPointTo.distance(distance);
                });
            }

        }

        /**
         * Update and save waypoints position into list
         */
        private updateWayPointsPositions(): void {

            let wPoints: models.WayPoint[] = [];

            $('#waypoints > ul > li').each(function() {
                let $item = $(this);
                let wayPoint = ko.dataFor(this);
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


        }



    }

}