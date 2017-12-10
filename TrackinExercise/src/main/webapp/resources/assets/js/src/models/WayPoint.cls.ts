module trackinexercise.models {

    /**
     * Class WayPoint
     */
    export class WayPoint extends commons.API {

        private static API: string = "api/waypoints";

        // Data properties
        public label: string;
        public latitude: string;
        public longitude: string;
        public position: number;
        public tourId: number;
        public type: KnockoutObservable<number> = ko.observable<number>();

        // Data calculation
        public distance: KnockoutObservable<number> = ko.observable<number>(0);
        public duration: KnockoutObservable<number> = ko.observable<number>(0);
        public distanceInMiles: KnockoutComputed<number>;
        public durationInMinutes: KnockoutComputed<number>;

        // Extra properties
        public marker;
        public infoWindow;

        public constructor(json?: any) {

            super(WayPoint.API);

            if (typeof (json) == 'object') {
                this.fromJson(json);
            }

            if (typeof (json) == 'string') {
                this.label = json;
            }

            // Auto convert distance into miles
            this.distanceInMiles = ko.computed((): number => {
                let distance: number = this.distance();
                return Math.round(distance / MILE * 100) / 100;
            }).extend({ throttle: 100 });

            // Auto convert duration into seconds
            this.durationInMinutes = ko.computed((): number => {
                let duration: number = this.duration();
                return Math.round(duration / 60);
            }).extend({ throttle: 100 });

            this.type.subscribe((): void => {
                if (this.marker) {
                    this.marker.setIcon({
                        url: this.getIcon(),
                        scaledSize: new google.maps.Size(35, 35)
                    });
                }
            });

        }

        /**
         * Return waypoint icon
         */
        public getIcon(): string {
            return this.type() == 1 ? 'resources/assets/images/dropoff-icon.png' : 'resources/assets/images/pickup-icon.png';
        }

        // Return waypoint data
        public data(): any {
            return {
                id: this.id,
                label: this.label,
                latitude: this.latitude,
                longitude: this.longitude,
                position: this.position,
                tourId: this.tourId,
                type: this.type()
            }
        }

        // Set waypoint data from json
        public fromJson(json: any): any {
            this.id = json.id;
            this.label = json.label;
            this.latitude = json.latitude;
            this.longitude = json.longitude;
            this.position = json.position;
            this.tourId = json.tourId;
            this.type(json.type);
        }

        /**
         * Return geoposition
         */
        public getCoordinates(): any {
            return {
                lat: parseFloat(this.latitude),
                lng: parseFloat(this.longitude)
            };
        }

        /**
         * Update geopos
         */
        public setCoordinates(lat, lng) {
            this.latitude = lat;
            this.longitude = lng;
        }

        /**
         * Change type
         */
        public setType(n: number): void {
            this.type(n);
            // Autosave
            this.save();
        }


    }

}