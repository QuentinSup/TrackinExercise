module trackinexercise {

    export var MILE: number = 1609.344;

    /**
     * Class used to manage waypoints list
     */
    export class WayPointsManager {

        public wayPointsList = ko.observableArray<models.WayPoint>();
        public globalDuration = ko.observable<number>();
        public globalDistance = ko.observable<number>();

        public distanceInMiles: KnockoutComputed<number>;
        public durationInMinutes: KnockoutComputed<number>;

        private _computed;

        /**
         * Constructor
         */
        constructor() {

            this._computed = ko.computed((): void => {
                let wPoints: models.WayPoint[] = this.wayPointsList();
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

        public create(wayPoint: models.WayPoint, fn?: Function): void {
            
            let wayPoints: models.WayPoint[] = this.all();
            
            // Autoset position
            wayPoint.position = wayPoints.length;
            // Autoset type (first must be pickup)
            wayPoint.type(wayPoints.length == 0?0:1);
            
            // Save to database
            wayPoint.save((wPoint: models.WayPoint): void => {

                this.wayPointsList.push(wPoint);

                if ($.isFunction(fn)) {
                    fn.call(this, wPoint);
                }
            });

        }

        /**
         * Return all the waypoints
         */
        public all(): models.WayPoint[] {
            return this.wayPointsList();
        }

        /**
         * Remove a waypoint from list and databae
         */
        public remove(wayPoint: models.WayPoint, fn?: Function): void {

            wayPoint.remove((wPoint: models.WayPoint): void => {

                // Remove waypoint from list
                this.wayPointsList.remove(wPoint);

                if ($.isFunction(fn)) {
                    fn.call(this, wPoint);
                }
            });

        }

        /**
         * List waypoints from database
         */
        public list(fn?: Function): void {

            new models.WayPoint().list((data): void => {

                $.each(data, (n, waypointJson): void => {
                    this.wayPointsList.push(new models.WayPoint(waypointJson));
                });

                if ($.isFunction(fn)) {
                    fn.call(this, this.all());
                }

            });
        }

    }

}