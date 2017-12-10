module trackinexercise.models {

    export var MILE: number = 1609.344;

    /**
     * Class used to manage waypoints list
     */
    export class Tour extends commons.API {

        private static API: string = "api/tours";

        public driverId: number;

        // Extra
        public wayPoints = ko.observableArray<models.WayPoint>();
        public globalDuration = ko.observable<number>();
        public globalDistance = ko.observable<number>();

        public distanceInMiles: KnockoutComputed<number>;
        public durationInMinutes: KnockoutComputed<number>;

        private _computed;

        /**
         * Constructor
         */
        constructor(json?: any) {

            super(Tour.API);

            if (typeof (json) == 'object') {
                this.fromJson(json);
            }

            this._computed = ko.computed((): void => {
                let wPoints: models.WayPoint[] = this.wayPoints();
                let duration = 0;
                let distance = 0;
                for (let i = 0; i < wPoints.length; i++) {
                    let wPoint = wPoints[i];
                    duration += wPoint.duration();
                    distance += wPoint.distance();
                }

                this.globalDistance(distance);
                this.globalDuration(duration);

            }).extend({ throttle: 100 });

            this.distanceInMiles = ko.computed((): number => {
                let distance: number = this.globalDistance();
                return Math.round(distance / MILE * 100) / 100;
            }).extend({ throttle: 100 });

            this.durationInMinutes = ko.computed((): number => {
                let duration: number = this.globalDuration();
                return Math.round(duration / 60);
            }).extend({ throttle: 100 });
        }

        // Return route data
        public data(): any {
            return {
                id: this.id,
                driverId: this.driverId
            }
        }

        // Set driver data from json
        public fromJson(json: any): any {
            this.id = json.id;
            this.driverId = json.driverId;
        }

        // Add waypoint to the route
        public push(wayPoint: models.WayPoint, fn?: Function): void {

            let wayPoints: models.WayPoint[] = this.all();

            // Autoset position
            wayPoint.position = wayPoints.length;
            // Autoset type (first must be pickup)
            wayPoint.type(wayPoints.length == 0 ? 0 : 1);
			// Autoset tour id
			wayPoint.tourId = this.id;

            // Save to database
            wayPoint.save((wPoint: models.WayPoint): void => {

                this.wayPoints.push(wPoint);

                if ($.isFunction(fn)) {
                    fn.call(this, wPoint);
                }
            });

        }

        /**
         * Return all the waypoints
         */
        public all(): models.WayPoint[] {
            return this.wayPoints();
        }

        /**
         * Remove a waypoint from list and database
         */
        public detach(wayPoint: models.WayPoint, fn?: Function): void {

            wayPoint.remove((wPoint: models.WayPoint): void => {

                // Remove waypoint from list
                this.wayPoints.remove(wPoint);

                if ($.isFunction(fn)) {
                    fn.call(this, wPoint);
                }
            });

        }

        /**
         * List waypoints from database
         */
        public loadWayPoints(fn?: Function): void {

            this.sublist('waypoints', (data): void => {

                $.each(data, (n, waypointJson): void => {
                    this.wayPoints.push(new models.WayPoint(waypointJson));
                });

                if ($.isFunction(fn)) {
                    fn.call(this, this.all());
                }

            });
        }

    }

}