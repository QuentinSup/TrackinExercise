/// <reference path="WayPointsManager.cls.ts"/>
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
        // Waypoints manager
        public wayPoints: WayPointsManager = new WayPointsManager();
        // Drivers
        public driversList: KnockoutObservableArray<models.Driver> = ko.observableArray<models.Driver>();

        // Message trigger
        public calculatingRoute: KnockoutObservable<boolean> = ko.observable<boolean>(false);

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
         * Initialization
         */
        public init(): void {
            this.gMap.initGMap();
            this.retrieveWayPointList();
            this.retrieveDriverList();

            $('#search-box-area').on('mouseleave', (): void => {
                $('#search-box').removeClass('slideInUp').addClass('slideOutDown');
            });

            $('#search-box-area').on('mouseenter', (): void => {
                $('#search-box').removeClass('slideOutDown').addClass('slideInUp');
            });

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
        public drawWayPointsRoads(optimize: boolean = false): void {

            this.gMap.cleanRoads();

            let wayPointsData: models.WayPoint[] = this.wayPoints.all();

            if (wayPointsData.length == 0) {
                return;
            }

            // First waypoint
            wayPointsData[0].duration(0);
            wayPointsData[0].distance(0);

            this.gMap.drawRoute(wayPointsData, optimize, (directions: any, wayPointsMapped: models.WayPoint[]): void => {
                let wayPointsList: models.WayPoint[] = [];
                wayPointsList.push(wayPointsData[0]);
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

                // Update waypoint order
                this.wayPoints.wayPointsList([]);
                this.wayPoints.wayPointsList(wayPointsList);
            });

        }

        /**
         * Update and save waypoints position into list
         */
        private updateWayPointsPositions(): void {

            let wPoints: models.WayPoint[] = [];

            // Could be optimized to save new ordre with one transaction
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
         * 
         */
        public talk(): void {
            let message: string = MESSAGES[this.messageIndex++];
            if (this.messageIndex >= MESSAGES.length) {
                this.messageIndex = 0;
            }
            this.toast(message, 'Need help ?');
        }

    }

}